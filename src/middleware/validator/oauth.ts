import Joi from '@hapi/joi';
import Async from '../../utils/async-wrapper';
import db from '../../db/models';
import * as Oauth from '../../typings/oauth';

export const login = Async<any, any, Oauth.Login>(async (req, res, next) => {
  const schema = Joi.object<Oauth.Login>({
    email: Joi
      .string()
      .trim()
      .email()
      .message('please provide a valid email')
      .required()
      .messages({
        'string.empty': 'email cannot be empty',
        'any.required': 'email is required',
      }),
    password: Joi
      .string()
      .ruleset
      .min(4)
      .max(16)
      .message('password must be between 4 and 16 characters')
      .required()
      .messages({
        'string.empty': 'provide a password',
        'any.required': 'password is required',
      }),
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
    client: Joi
      .string()
      .trim()
      .pattern(/client_\w{16}/)
      .message('client id is invalid')
      .required()
      .messages({
        'string.empty': 'provide a client id',
        'any.required': 'client is required',
      }),
    redirectUri: Joi
      .string()
      .uri()
      .message('invalid redirect URI')
      .required()
      .messages({
        'string.empty': 'provide a redirect URI',
        'any.required': 'redirect_uri is required',
      }),
    scopes: Joi
      .array()
      .items(Joi.string().label('scopes').valid(db.scopes), Joi.any().strip())
      .min(1)
      .message('no scopes provided')
      .messages({ 'array.includesRequiredKnowns': 'provide a scope name' }),
    state: Joi
      .string()
      .required()
      .messages({
        'string.empty': 'provide a state token',
        'any.required': 'state is required',
      }),
  });

  req.body = await schema.validateAsync(req.body, { abortEarly: false, stripUnknown: true });

  return next();
});

export const authorizeClient = Async<Oauth.AuthorizeClient>(async (req, res, next) => {
  const schema = Joi.object<Oauth.AuthorizeClient>({
    id: Joi
      .string()
      .trim()
      .pattern(/client_\w{16}/)
      .message('client id is invalid')
      .required()
      .messages({ 'string.empty': 'provide a client id' }),
  });

  req.params = await schema.validateAsync(req.params, { abortEarly: false, stripUnknown: true });

  return next();
});

export const getAccessToken = Async<any, any, Oauth.GetAccessToken>(async (req, res, next) => {
  const schema = Joi.object<Oauth.GetAccessToken>({
    code: Joi
      .string()
      .required()
      .messages({
        'string.empty': 'provide a state token',
        'any.required': 'state is required',
      }),
    redirectUri: Joi
      .string()
      .uri()
      .message('no redirect URIs provided')
      .messages({ 'array.includesRequiredKnowns': 'provide a valid redirect URI' }),
    client: Joi
      .string()
      .trim()
      .pattern(/client_\w{16}/)
      .message('client id is invalid')
      .required()
      .messages({
        'string.empty': 'provide a client id',
        'any.required': 'client is required',
      }),
    secret: Joi
      .string()
      .required()
      .messages({
        'string.empty': 'provide a state token',
        'any.required': 'state is required',
      }),
  });

  req.body = await schema.validateAsync(req.body, { abortEarly: false, stripUnknown: true });

  return next();
});

export const authenticateToken = Async<Oauth.AuthenticateToken>(async (req, res, next) => {
  const schema = Joi.object<Oauth.AuthenticateToken>({
    token: Joi
      .string()
      .trim()
      .length(32)
      .message('invalid token')
      .required()
      .messages({ 'string.empty': 'provide a token' }),
  });

  req.query = await schema.validateAsync(req.query, { abortEarly: false, stripUnknown: true });

  return next();
});
