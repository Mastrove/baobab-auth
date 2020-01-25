import Joi from '@hapi/joi';
import * as Client from '../../typings/client';
import Async from '../../utils/async-wrapper';
import db from '../../db/models';

export const create = Async<any, any, Client.CreateClient>(async (req, res, next) => {
  const schema = Joi.object<Client.CreateClient>({
    name: Joi
      .string()
      .trim()
      .required()
      .messages({ 'string.empty': 'provide a client name' }),
    scopes: Joi
      .array()
      .items(Joi.string().label('scopes').valid(db.scopes), Joi.any().strip())
      .min(1)
      .message('no scopes provided')
      .required()
      .messages({ 'array.includesRequiredKnowns': 'provide a scope name' }),
    redirectUrls: Joi
      .array()
      .items(Joi.string().uri().label('redirect URI'), Joi.any().strip())
      .min(1)
      .message('no redirect URIs provided')
      .required()
      .messages({ 'array.includesRequiredKnowns': 'provide a valid redirect URI' }),
  });

  req.body = await schema.validateAsync(req.body, { abortEarly: false, stripUnknown: true });

  return next();
});

export const get = Async<Client.GetClient>(async (req, res, next) => {
  const schema = Joi.object({
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

export const update = Async<any, any, Client.UpdateClient>(async (req, res, next) => {
  const schema = Joi.object<Client.UpdateClient>({
    id: Joi
      .string()
      .trim()
      .pattern(/client_\w{16}/)
      .message('client id is invalid')
      .required()
      .messages({ 'string.empty': 'provide a client id' }),
    scopes: Joi
      .array()
      .items(Joi.string().label('scopes').valid(db.scopes), Joi.any().strip())
      .min(1)
      .message('no scopes provided')
      .messages({ 'array.includesRequiredKnowns': 'provide a scope name' }),
    redirectUrls: Joi
      .array()
      .items(Joi.string().uri().label('redirect URI'), Joi.any().strip())
      .min(1)
      .message('no redirect URIs provided')
      .messages({ 'array.includesRequiredKnowns': 'provide a valid redirect URI' }),
  }).or('scopes', 'redirectUrls')
    .message('no data to update');

  req.body = await schema.validateAsync(req.body, { abortEarly: false, stripUnknown: true });

  return next();
});
