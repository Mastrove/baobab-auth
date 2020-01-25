import Sequelize from 'sequelize';
import { Models, ModelStatic } from '.';
import * as User from './user';

export interface OrganizationAttributes {
  id: string;
  name: string;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrganizationInstance extends Sequelize.Model, OrganizationAttributes {
  members: User.UserAttributes[];
  owner: User.UserAttributes;
}

export default (sequelize: Sequelize.Sequelize): ModelStatic<OrganizationInstance> => {
  const Organization = sequelize.define('Organization', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.STRING,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    createdBy: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  }, {}) as ModelStatic<OrganizationInstance>;

  Organization.associate = (models: Models): void => {
    Organization.belongsToMany(models.User, {
      as: 'members',
      foreignKey: 'organizationId',
      through: 'UserOrganization',
    });

    Organization.belongsTo(models.User, {
      as: 'owner',
      foreignKey: 'createdBy',
      onDelete: 'CASCADE',
    });
  };

  return Organization;
};
