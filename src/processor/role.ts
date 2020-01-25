import Sequelize from 'sequelize';
import models from '../db/models';
import { RoleInstance } from 'db/models/roles';

export const update = async (roleId: string, values: { [key: string]: string | string[] }, transaction: Sequelize.Transaction): Promise<RoleInstance> => {
  const [, [updatedRole]] = await models.Role.update({
    ...values
  }, { where: { id: roleId }, transaction });


  return updatedRole;
};
