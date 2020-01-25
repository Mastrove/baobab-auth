import Async from '../utils/async-wrapper';
import * as processor from '../processor/client';

export const create = Async(async (req, res) => {
  const newClientId = await processor.create(req.body);

  const client = await processor.getOne(newClientId);

  res.status(200).json({ client });
});

export const getOne = Async(async (req, res) => {
  const client = await processor.getOne(req.params.id);

  res.status(200).send({ client });
});

export const update = Async(async (req, res) => {
  const client = await processor.update(req.body);

  return res.status(200).json({ client });
});
