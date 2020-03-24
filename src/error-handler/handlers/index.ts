import auth from './auth';
import client from './client';
import authenticator from './authenticator';
import { DatabaseError } from 'sequelize';
import { ValidationError } from 'sequelize';

export default [
  auth,
  client,
  authenticator,
];

interface DatabaseOriginalError extends Error {
  constraint: string;
}

export interface constraintErrors extends DatabaseError, ValidationError {
  original: DatabaseOriginalError;
}
