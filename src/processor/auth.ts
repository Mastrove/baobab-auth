import crypto from 'crypto';
import axios from 'axios';
import models from '../db/models';
import txWrapper from '../utils/transaction-wrapper';
import * as Auth from '../typings/auth';

export const signUp = async (userData): Promise<Auth.SignUpSuccess> => {
  const data = await txWrapper(async (transaction) => {
    const user = await models.User.create({
      id: `usr_${crypto.randomBytes(8).toString('hex')}`,
      email: userData.email,
    }, { transaction });

    const organization = await models.Organization.create({
      id: `org_${crypto.randomBytes(8).toString('hex')}`,
      name: userData.organization,
      createdBy: user.id,
    }, { transaction });

    await models.UserOrganization.create({
      id: `usr_org_${crypto.randomBytes(8).toString('hex')}`,
      userId: user.id,
      organizationId: organization.id,
      roleId: 'role_default_admin',
    }, { transaction });

    await axios.post(`${process.env.BAOBAB_API}/auth/signUp`, {
      organization: organization.id,
      email: user.email,
      password: userData.password,
      isNewOrganization: true,
    });

    return { user, organization };
  });

  return data;
};

export const signUpInvite = async (userData: Auth.SignUp): Promise<Auth.SignUpSuccess> => {
  const data = await txWrapper(async (transaction) => {
    const [user] = await models.User.upsert({
        id: `usr_${crypto.randomBytes(8).toString('hex')}`,
        email: userData.email,
      },
      { returning: true, transaction }
    );

    const [userOrg, created] = await models.UserOrganization.findOrCreate({
      where: {
        userId: user.id,
        organizationId: userData.organization,
      },
      defaults: {
        id: `usr_org_${crypto.randomBytes(8).toString('hex')}`,
        roleId: 'role_default_user',
      },
      transaction,
    });

    const organization = await models.Organization.findOne({ where: { id: userOrg.organizationId } });

    if (created) {
      await axios.post(`${process.env.BAOBAB_API}/auth/signUp`, {
        organization: userData.organization,
        email: user.email,
        password: userData.password,
        isNewOrganization: false,
      });
    } else {
      await axios.post(`${process.env.BAOBAB_API}/auth/signIn`, {
        organization: userData.organization,
        email: user.email,
        password: userData.password,
      });
    }

    return { user, organization };
  });

  return data;
};
