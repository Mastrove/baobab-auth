import Joi from '@hapi/joi';
import * as Auth from '../../typings/auth';
import Async from '../../utils/async-wrapper';

export const signUp = Async<any, any, Auth.SignUp>(async (req, res, next) => {
  const schema = Joi.object<Auth.SignUp>({
    email: Joi
      .string()
      .trim()
      .email()
      .message('please provide a valid email')
      .required()
      .messages({ 'string.empty': 'email cannot be empty' }),
    organization: Joi
      .string()
      .trim()
      .ruleset
      .min(4)
      .max(20)
      .message('organization must be between 4 and 20 characters')
      .required()
      .messages({
        'string.empty': 'provide an organization ID',
        'any.required': 'organization is required',
      }),
    password: Joi
      .string()
      .ruleset
      .min(4)
      .max(16)
      .message('password must be between 4 and 16 characters')
      .required()
      .messages({ 'string.empty': 'provide a password' }),
  });

  req.body = await schema.validateAsync(req.body, { abortEarly: false, stripUnknown: true });

  return next();
});
