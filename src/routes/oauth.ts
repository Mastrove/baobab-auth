import { Router } from 'express';
import * as controller from '../controller/oauth';
import * as validator from '../middleware/validator/oauth';
import authenticator from '../middleware/authenticator';

const route = Router();

route.post('/login', validator.login, authenticator, controller.login);

route.post('/access_token', validator.getAccessToken, authenticator, controller.getAccessToken);

route.get('/authenticate_token', validator.authenticateToken, authenticator, controller.authenticateToken);

export default route;
