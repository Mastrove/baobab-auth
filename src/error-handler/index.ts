import handlers from './handlers';
import Joi from '@hapi/joi';

interface CustomError extends Error {
  isCustomError: boolean;
  content: any;
  status: number;
}

class CustomError extends Error {
  constructor(error: Error = null, content: any = null, status: number = null) {
    super('');

    this.isCustomError = true;
    this.content = content;
    this.status = status;

    if ((error as Error as Joi.ValidationError).isJoi) {
      console.dir(error, { depth: null });
      this.content = (error as Error as Joi.ValidationError).details.reduce((acc, err) => ({ ...acc, [err.path[0]]: err.message }), {});
      this.status = 422;
    } else {
      handlers.find((handler) => {
        const { content, status } = handler(error);

        if (content && status) {
          this.content = content;
          this.status = status;

          return true;
        }

        return false;
      });
    }

    if (!(this.content && this.status)) {
      console.log(error);
      this.content = 'Internal server error';
      this.status = 500;
    }
  }

  static withDetails(status, content): CustomError {

    return new CustomError(null, status, content);
  }
}

export default CustomError;
