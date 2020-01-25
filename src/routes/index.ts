import { Router } from 'express';
import auth from './auth';
import oauth from './oauth';
// import role from './role';
import client from './client';

const route = Router();

route.use('/auth', auth);

route.use('/oauth', oauth);

// route.use('/oauth/role', role);

route.use('/client', client);

route.use('/callback', (req, res) => {
  console.log(req.body);

  res.status(200).send('ok');
});

export default route;
