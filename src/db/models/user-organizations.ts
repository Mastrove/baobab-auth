import Sequelize from 'sequelize';
import { Models, ModelStatic } from '.';
import * as User from './user';
import * as Organization from './organization';
import * as Role from './roles';

export interface UserOrganizationAttributes {
  id: string;
  userId: string;
  organizationId: string;
  roleId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserOrganizationInstance extends Sequelize.Model, UserOrganizationAttributes {
  user: User.UserAttributes;
  organization: Organization.OrganizationAttributes;
  role: Role.RoleAttributes;
}

export default (sequelize: Sequelize.Sequelize): ModelStatic<UserOrganizationInstance> => {
  const UserOrganization = sequelize.define('UserOrganization', {
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
    roleId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  }, {}) as ModelStatic<UserOrganizationInstance>;

  UserOrganization.associate = (models: Models): void => {
    UserOrganization.belongsTo(models.User, {
      as: 'user',
      onDelete: 'CASCADE',
    });

    UserOrganization.belongsTo(models.Organization, {
      as: 'organization',
      onDelete: 'cascade',
    });

    UserOrganization.belongsTo(models.Role, {
      as: 'role',
      onDelete: 'cascade',
    });
  };

  return UserOrganization;
};
