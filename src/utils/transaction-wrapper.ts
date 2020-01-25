import Sequelize from 'sequelize';
import models from '../db/models';

export default async <T>(callback: (tx: Sequelize.Transaction) => Promise<T>): Promise<T> => {
  const tx = await models.sequelize.transaction();
  try {
    const result = await callback(tx);
    tx.commit();
    return result;
  } catch (error) {
    tx.rollback();
    throw error;
  }
};
