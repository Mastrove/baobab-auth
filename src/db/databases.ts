import { Sequelize } from 'sequelize';
import fs from 'fs';
import path from 'path';

export const databases = new Map();

export const syncDB = (sequelize: Sequelize, dir, basename) => {
  const db:any = {};

  fs.readdirSync(dir)
    .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
    .forEach((file) => {
      const model = sequelize.import(path.join(dir, file));
      db[model.name] = model;
    });

  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  db.sequelize = sequelize;

  return db;
};
