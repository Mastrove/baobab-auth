import jwt from 'jsonwebtoken';
import Async from '../utils/async-wrapper';

const verify = Async(async (req, res, next) => {
  const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : '';
  await new Promise((resolve, reject) => {
    jwt.verify(token, process.env.SSO_SECRET_KEY, (err, decoded) => {
      if (err) reject(err);
      else resolve(decoded);
    });
  });

  next();
});

export default verify;
