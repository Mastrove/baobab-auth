import { basename as _basename } from 'path';
import fs from 'fs';
import path from 'path';
import Sequelize, { Model } from 'sequelize';
import createConnection from '../../utils/connection';
import config from '../../config/database';
import { AccessTokenInstance } from './access-tokens';
import { ClientInstance } from './clients';
import { OrganizationInstance } from './organization';
import { RoleInstance } from './roles';
import { UserClientInstance } from './user-clients';
import { UserOrganizationInstance } from './user-organizations';
import { UserInstance } from './user';

const basename = _basename(__filename);

const sequelize = new Sequelize.Sequelize(createConnection(), config.options);

let models: Models = {
  AccessToken: null,
  Client: null,
  Organization: null,
  Role: null,
  UserClient: null,
  UserOrganization: null,
  User: null,
  sequelize: null,
  scopes: null,
};

const db = {
  AccessToken: null,
  Client: null,
  Organization: null,
  Role: null,
  UserClient: null,
  UserOrganization: null,
  User: null,
};

fs.readdirSync(__dirname)
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

models = { ...models, ...db }

models.sequelize = sequelize;

models.scopes = ['read_user', 'write_user', 'read_pod', 'write_pod'];

export type ModelStatic<T extends Sequelize.Model> = typeof Sequelize.Model & {
  new (values?: object, options?: Sequelize.BuildOptions): T;
  associate: (model: Models) => void;
}

export type AccessToken = ModelStatic<AccessTokenInstance>;
export type Client = ModelStatic<ClientInstance>;
export type Organization = ModelStatic<OrganizationInstance>;
export type Role = ModelStatic<RoleInstance>;
export type UserClient = ModelStatic<UserClientInstance>;
export type UserOrganization = ModelStatic<UserOrganizationInstance>;
export type User = ModelStatic<UserInstance>;

export interface Models {
  AccessToken: ModelStatic<AccessTokenInstance>;
  Client: ModelStatic<ClientInstance>;
  Organization: ModelStatic<OrganizationInstance>;
  Role: ModelStatic<RoleInstance>;
  UserClient: ModelStatic<UserClientInstance>;
  UserOrganization: ModelStatic<UserOrganizationInstance>;
  User: ModelStatic<UserInstance>;
  sequelize: Sequelize.Sequelize;
  scopes: string[];
}

export default models;
