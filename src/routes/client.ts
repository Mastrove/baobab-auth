import { Router } from 'express';
import * as controller from '../controller/client';
import authenticator from '../middleware/authenticator';
import * as validator from '../middleware/validator/client';

const route = Router();

route.post('/create', validator.create, authenticator, controller.create);

route.get('/get_self/:id', validator.get, authenticator, controller.getOne);

route.put('/update/:id', validator.update, authenticator, controller.update);

export default route;
