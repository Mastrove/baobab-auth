import crypto from 'crypto';
import models from '../db/models';
import txWrapper from '../utils/transaction-wrapper';
import { ClientInstance } from 'db/models/clients';
import * as Client from '../typings/client';
import * as RoleProcessor from './role';

export const create = async (data: Client.CreateClient): Promise<string> => {
  const newClientId = await txWrapper(async (transaction) => {
    const role = await models.Role.create({
      id: `role_${crypto.randomBytes(8).toString('hex')}`,
      name: data.name,
      type: 'client',
      scopes: data.scopes,
    }, { transaction });

    const newClient = await models.Client.create({
      id: `client_${crypto.randomBytes(8).toString('hex')}`,
      name: data.name,
      secret: crypto.randomBytes(16).toString('hex'),
      redirectUrls: data.redirectUrls,
      roleId: role.id,
    }, { transaction });

    return newClient.id;
  });

  return newClientId;
};

export const getOne = async (id: string): Promise<ClientInstance> => {
  const client = await models.Client.findOne({
    where: { id },
    attributes: {
      exclude: ['roleId', 'createdAt', 'updatedAt'],
    },
    include: [{
      model: models.Role, 
      as: 'role',
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    }],
  });

  return client;
};

export const update = async (data: Client.UpdateClient): Promise<ClientInstance> => {
  const { scopes, ...values } = data;
  const client = await models.Client.findOne({ where: { id: data.id } });

  const updatedClient = await txWrapper(async (transaction) => {
    const [, [updatedClient]] = await models.Client.update({ ... values }, { where: { id: client.id }, transaction });

    if (scopes) {
      await RoleProcessor.update(client.roleId, { scopes }, transaction)
    }

    return updatedClient;
  });

  return updatedClient;
};
