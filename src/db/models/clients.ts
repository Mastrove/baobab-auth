import Sequelize from 'sequelize';
import { Models, ModelStatic } from '.';
import * as Role from './roles';

export interface ClientAttributes {
  id: string;
  name: string;
  secret: string;
  redirectUrls: string;
  roleId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ClientInstance extends Sequelize.Model, ClientAttributes {
  role: Role.RoleAttributes;
}

export default (sequelize: Sequelize.Sequelize): ModelStatic<ClientInstance> => {
  const Client = sequelize.define('Client', {
    id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    secret: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    redirectUrls: {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: false,
    },
    roleId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  }, {}) as ModelStatic<ClientInstance>;

  Client.associate = (models: Models): void => {
    Client.belongsTo<ClientInstance, Role.RoleInstance>(models.Role, {
      as: 'role',
      onDelete: 'cascade',
    });
  };

  return Client;
};
