import Async from '../utils/async-wrapper';
import * as processor from '../processor/oauth';

export const login = Async(async (req, res) => {
  const result = await processor.login(req.body);

  res.status(200).json(result);
});

export const getAccessToken = Async(async (req, res) => {
  await processor.sendAccessToken(req.body);

  res.status(200).send('successful');
});

export const authenticateToken = Async(async (req, res) => {
  const authData = await processor.authenticateToken(req.query);

  res.status(200).json({
    user: authData,
  });
});
