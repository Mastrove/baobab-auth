import Sequelize, { DatabaseError, ValidationError } from 'sequelize';
import * as constraints from '../../db/database-constraints';
import { constraintErrors } from '.';

export default (error: Error | DatabaseError) => {
  let status: number;
  let content: any;

  if (error instanceof Sequelize.UniqueConstraintError) {
    status = 409;

    switch ((<constraintErrors><ValidationError>error).original.constraint) {
      case constraints.USERS_UNIQUE_EMAIL:
        content = { email: 'email already exists on baobab' };
        break;

      default:
        break;
    }
  }

  return { status, content };
};
