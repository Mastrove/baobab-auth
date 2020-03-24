import Sequelize from 'sequelize';
import { ModelStatic } from '.';

export interface RoleAttributes {
  id: string;
  name: string;
  type: 'organization' | 'client' | 'client-user';
  scopes: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type RoleInstance = Sequelize.Model & RoleAttributes;

export default (sequelize: Sequelize.Sequelize): ModelStatic<RoleInstance> => {
  const Role = sequelize.define('Role', {
    id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    type: {
      type: Sequelize.ENUM('organization', 'client', 'client-user'),
      allowNull: false,
    },
    scopes: {
      allowNull: false,
      type: Sequelize.ARRAY(Sequelize.STRING),
    },
  }, {}) as ModelStatic<RoleInstance>;

  return Role;
};
