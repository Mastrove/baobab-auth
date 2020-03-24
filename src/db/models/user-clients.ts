import Sequelize from 'sequelize';
import { Models, ModelStatic } from '.';
import * as User from './user';
import * as Organization from './organization';
import * as Client from './clients';
import * as Role from './roles';

export interface UserClientAttributes {
  id: string;
  userId: string;
  organizationId: string;
  clientId: string;
  roleId: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserClientInstance extends Sequelize.Model, UserClientAttributes {
  user: User.UserAttributes;
  organization: Organization.OrganizationAttributes;
  client: Client.ClientAttributes;
  role: Role.RoleAttributes;
}

export default (sequelize: Sequelize.Sequelize): ModelStatic<UserClientInstance> => {
  const UserClient = sequelize.define('UserClient', {
    id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    },
    userId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    organizationId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    clientId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    roleId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  }, {}) as ModelStatic<UserClientInstance>;

  UserClient.associate = (models: Models): void => {
    UserClient.belongsTo(models.User, {
      as: 'user',
      onDelete: 'cascade',
    });

    UserClient.belongsTo(models.Organization, {
      as: 'organization',
      onDelete: 'cascade',
    });

    UserClient.belongsTo(models.Client, {
      as: 'client',
      onDelete: 'cascade',
    });

    UserClient.belongsTo(models.Role, {
      as: 'role',
      onDelete: 'cascade',
    });
  };

  return UserClient;
};
