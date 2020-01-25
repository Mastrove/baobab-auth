import jwt from 'jsonwebtoken';
import Async from '../utils/async-wrapper';
import * as processor from '../processor/auth';

export const SignUp = Async(async (req, res) => {
  const user = await processor.signUp(req.body);
  res.status(201).json({
    ...user,
  });
});

export const getToken = Async(async (req, res) => {
  const { client, secret } = req.body;

  if (process.env.SSO_CLIENT_ID !== client && process.env.SSO_CLIENT_SECRET !== secret) {
    return res.status(409).json({ error: 'invalid client credentials' });
  }

  const token = jwt.sign(
    { type: 'SSO_CLIENT' },
    process.env.SSO_SECRET_KEY,
    { expiresIn: '1 day' },
  );

  return res.status(200).json({
    token,
  });
});
