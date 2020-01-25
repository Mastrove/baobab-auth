/* eslint-disable no-restricted-syntax */
require('dotenv').config();

const Sequelize = require('sequelize');
const createConnection = require('../utils/connection');
const { migrateDB } = require('../db/databases');
const model = require('../db/models');
const config = require('../config/database');

const migrateMainDB = async () => {
  const sequelize = new Sequelize(createConnection(), config.options);

  const migrations = await migrateDB(sequelize, 'Main database', true);
  await sequelize.close();

  return migrations;
};

const migrateLocalDB = async (dbName, seq) => {
  const db = await seq.query(`SELECT FROM pg_database WHERE datname = '${dbName}'`, {
    plain: true,
    type: Sequelize.QueryTypes.SELECT,
    raw: true,
  });

  if (!db) await seq.query(`CREATE DATABASE ${dbName};`);

  const sequelize = new Sequelize(createConnection(dbName), config.options);
  const migrations = await migrateDB(sequelize, dbName);

  await sequelize.close();

  return migrations;
};

const migrateAllLocal = async () => {
  const organizations = await model.Organization.findAll({});

  for (const organization of organizations) {
    // eslint-disable-next-line no-await-in-loop
    await migrateLocalDB(organization.organizationName, model.sequelize);
  }
};

const dropAllLocal = async () => {
  const organizations = await model.Organization.findAll({});

  for (const organization of organizations) {
    // eslint-disable-next-line no-await-in-loop
    await model.sequelize.query(`DROP DATABASE ${organization.id}`);
  }
};

(async () => {
  try {
    // eslint-disable-next-line no-unused-vars
    const [prc, pth, ...args] = process.argv;

    const choice = args[0];

    switch (choice) {
      case 'all':
        await migrateMainDB();
        await migrateAllLocal();
        break;

      case 'local':
        await migrateAllLocal();
        break;

      case 'main':
        await migrateMainDB();
        break;

      case 'drop:all':
        await dropAllLocal();
        break;

      default:
        break;
    }

    console.log('migration complete');

    process.exit(0);
  } catch (error) {
    console.error('migratrions were not successful');

    process.exit(1);
  }
})();
