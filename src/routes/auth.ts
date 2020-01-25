import { Router } from 'express';
import * as controller from '../controller/auth';
import * as validator from '../middleware/validator/auth';
import authenticator from '../middleware/authenticator';

const route = Router();

route.get('/signUp', validator.signUp, authenticator, controller.SignUp);

// route.get('/callback', /* validator.signUp, */authenticator, controller.callback);

route.post('/getToken', controller.getToken);

export default route;
