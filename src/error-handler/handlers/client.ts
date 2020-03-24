import Sequelize, { BaseError, ForeignKeyConstraintError, DatabaseError } from 'sequelize';
import * as constraints from '../../db/database-constraints';
import { constraintErrors } from '.';

export default (error: Error | BaseError) => {
  let status: number;
  let content: any;

  if (error instanceof ForeignKeyConstraintError) {
    status = 409;
    let err: ForeignKeyConstraintError = error;

    switch ((<constraintErrors><DatabaseError>error).original.constraint) {
      case constraints.CLIENT_ROLE_FKEY:
        content = { scopes: 'role does not exist' };
        status = 404;
        break;

      default:
        break;
    }
  }

  return { status, content };
};
