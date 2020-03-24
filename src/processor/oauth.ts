import crypto from 'crypto';
import axios from 'axios';
import lodash from 'lodash';
import moment from 'moment';
import { Op } from 'sequelize';
import models from '../db/models';
import ErrorHandler from '../error-handler';
import redisClient from '../utils/redis-client';
import txWrapper from '../utils/transaction-wrapper';
import * as Oauth from '../typings/oauth';
import * as AccessToken from 'db/models/access-tokens';

const Error = ErrorHandler.withDetails;

export const login = async (credentials: Oauth.Login): Promise<string> => {
  const client = await models.Client.findOne({
    where: {
      id: credentials.client,
      redirectUrls: {
        [Op.contains]: [credentials.redirectUri],
      },
    },
    attributes: {
      exclude: ['roleId'],
    },
    include: [{
      model: models.Role,
      as: 'role',
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'name'],
      },
    }],
  });

  if (!client) throw Error(404, { error: `client with redirect URI ${credentials.redirectUri} does not exist` });

  const userData = await models.UserOrganization.findOne({
    where: { organizationId: credentials.organization },
    attributes: {
      exclude: ['userId', 'organizationId', 'roleId'],
    },
    include: [{
      model: models.User,
      as: 'user',
      where: { email: credentials.email },
    }, {
      model: models.Role,
      as: 'role',
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'name'],
      },
    }, {
      model: models.Organization,
      as: 'organization',
    }],
  });

  if (!userData) throw Error(404, { error: 'email or organization name incorrect' });

  const isValidCredentials = await axios
    .post(`${process.env.BAOBAB_API}/auth/signIn`, {
      organization: credentials.organization,
      email: credentials.email,
      password: credentials.password,
    });

  if (!isValidCredentials) throw Error(409, { password: 'password is incorrect' });

  const scopes = lodash.intersection<string>(
    client.role.scopes,
    userData.role.scopes,
    credentials.scopes,
  );

  const authCode = crypto.randomBytes(8).toString('hex');

  await redisClient.setAsync(authCode, JSON.stringify({ client, userData, scopes }), 'EX', 3000);

  axios.post(credentials.redirectUri, {
    state: credentials.state,
    code: authCode,
  });

  return authCode;
};

const generateAccessToken = async (data: Oauth.ClientVerificationData): Promise<AccessToken.AccessTokenInstance> => {
  const accessToken = await txWrapper(async (transaction) => {
    const role = await models.Role.create({
      id: `role_${crypto.randomBytes(8).toString('hex')}`,
      name: `${data.client.id}-${data.userData.user.id}`,
      type: 'client-user',
      scopes: data.scopes,
    }, { transaction });

    await models.UserClient.create({
      id: `usrCl_${crypto.randomBytes(8).toString('hex')}`,
      userId: data.userData.user.id,
      clientId: data.client.id,
      roleId: role.id,
    }, { transaction });

    const token = await models.AccessToken.create({
      id: crypto.randomBytes(16).toString('hex'),
      userId: data.userData.user.id,
      organizationId: data.userData.organization.id,
      clientId: data.client.id,
      expiresAt: moment().add(15, 'h'),
    }, { transaction });

    return token;
  });

  return accessToken;
};

export const sendAccessToken = async (data: Oauth.GetAccessToken): Promise<boolean | void> => {
  const cachedData: Oauth.ClientVerificationData = await redisClient.getAsync(data.code)
    .then((value) => value && JSON.parse(value));

  if (!cachedData) throw Error(409, { message: 'invalid auth code' });

  const { scopes, client } = cachedData;

  if (!(client.secret === data.secret
      && client.id === data.client
      && client.redirectUrls.includes(data.redirectUri))) {
    throw (Error(409, { error: 'client credentials mismatch' }));
  }

  const accessToken = await generateAccessToken(cachedData);

  axios.post(data.redirectUri, {
    accessToken: accessToken.id,
    expiresIn: moment.duration(15, 'h').asMilliseconds(),
    scopes,
  });

  return true;
};

const checkToken = async (token: string, expiresAt: Date): Promise<void | boolean> => {
  if (expiresAt > new Date()) return true;

  await models.AccessToken.destroy({
    where: { id: token },
  });

  await redisClient.hdelAsync('AccessTokens', token);

  throw Error(409, { error: 'invalid or expired token' });
};

export const authenticateToken = async ({ token }: Oauth.AuthenticateToken): Promise<Oauth.TokenData> => {
  let data: Oauth.TokenData;

  data = await redisClient.hgetAsync('AccessTokens', token)
    .then((res) => JSON.parse(res));

  if (data) {
    await checkToken(token, data.expiresAt);
    return data;
  }

  const tokenData = await models.AccessToken.findOne({
    where: {
      id: token,
    },
  });

  if (tokenData) await checkToken(token, tokenData.expiresAt);

  const userClient = await models.UserClient.findOne({
    where: {
      userId: tokenData.userId,
      clientId: tokenData.clientId,
      organizationId: tokenData.organizationId,
    },
    include: [{
      model: models.Role,
      as: 'role',
    }],
  });

  data = {
    user: tokenData.userId,
    organization: tokenData.organizationId,
    client: tokenData.clientId,
    role: userClient.role,
    expiresAt: tokenData.expiresAt,
  };

  await redisClient.hsetAsync('AccessTokens', token, JSON.stringify(data));

  return data;
};
