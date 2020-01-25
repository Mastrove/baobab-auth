import Sequelize from 'sequelize';
import { Models, ModelStatic } from '.';
import * as Organization from './organization';

export interface UserAttributes {
  id: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserInstance extends Sequelize.Model, UserAttributes {
  ownedOrganizations: Organization.OrganizationAttributes[];
  organizations: Organization.OrganizationAttributes[];
  organization: Organization.OrganizationAttributes;
}

export default (sequelize: Sequelize.Sequelize): ModelStatic<UserInstance> => {
  const User = sequelize.define('User',
    {
      id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
    }, {}) as ModelStatic<UserInstance>;

  User.associate = (models: Models): void => {
    User.hasMany(models.Organization, {
      as: 'ownedOrganizations',
      foreignKey: 'createdBy',
      onDelete: 'CASCADE',
    });

    User.belongsToMany(models.Organization, {
      foreignKey: 'userId',
      as: 'organizations',
      through: 'UserOrganization',
    });

    User.belongsTo(models.Organization, {
      as: 'organization',
    });
  };

  return User;
};
