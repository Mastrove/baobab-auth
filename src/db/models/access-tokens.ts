import Sequelize from 'sequelize';
import { Models, ModelStatic } from '.';
import * as User from './user';
import * as Organization from './organization';
import * as Client from './clients';

export interface AccessTokenAttributes {
  id: string;
  userId: string;
  organizationId: string;
  clientId: string;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}


export interface AccessTokenInstance extends Sequelize.Model, AccessTokenAttributes {
  user: User.UserInstance;
  organization: Organization.OrganizationAttributes;
  client: Client.ClientAttributes;
}

export default (sequelize: Sequelize.Sequelize): ModelStatic<AccessTokenInstance> => {
  const AccessToken = sequelize.define('AccessToken', {
    id: {
      type: Sequelize.DataTypes.STRING,
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
    expiresAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  }, {}) as ModelStatic<AccessTokenInstance>;


  AccessToken.associate = (models: Models): void => {
    AccessToken.belongsTo(models.User, {
      as: 'user',
      onDelete: 'cascade',
    });

    AccessToken.belongsTo(models.Organization, {
      as: 'organization',
      onDelete: 'cascade',
    });

    AccessToken.belongsTo(models.Client, {
      as: 'client',
      onDelete: 'cascade',
    });
  };

  return AccessToken;
};
