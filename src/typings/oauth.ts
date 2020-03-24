import Sequelize from 'sequelize';
import * as UserOrganization from '../db/models/user-organizations';
import * as Client from '../db/models/clients';
import * as Role from '../db/models/roles';

export interface Login {
  email: string;
  password: string;
  organization: string;
  client: string;
  redirectUri: string;
  scopes: string[];
  state: string;
}

export interface AuthorizeClient extends stringDict {
  id: string;
}

export interface GetAccessToken {
  code: string;
  redirectUri: string;
  client: string;
  secret: string;
}

type stringDict = { [key: string]: string };

export interface AuthenticateToken extends stringDict {
  token: string;
}

export interface ClientVerificationData {
  userData: Omit<UserOrganization.UserOrganizationInstance, keyof Sequelize.Model>;
  scopes: string[];
  client: Omit<Client.ClientInstance, keyof Sequelize.Model>;
}

export interface TokenData {
  user: string;
  organization: string;
  client: string;
  role: Role.RoleAttributes;
  expiresAt: Date;
}
