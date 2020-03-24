import dotenv from 'dotenv';

dotenv.config();

export default {
  development: {
    databaseUrl: process.env.DATABASE_DEV_SERVER,
    username: 'kossy',
    password: 'blade',
    database: 'baobabdb',
    host: 'localhost',
    port: 5433,
    dialect: 'postgres',
  },
  // test: {
  //   use_env_variable: 'DATABASE_TEST_SERVER',
  //   username: 'kossy',
  //   password: 'blade',
  //   database: 'baobabdb',
  //   host: 'localhost',
  //   port: 5433,
  //   dialect: 'postgres',
  // },
  // production: {
  //   use_env_variable: 'DATABASE_SERVER',
  //   username: 'kossy',
  //   password: 'blade',
  //   database: 'baobabdb',
  //   host: 'localhost',
  //   port: 5433,
  //   dialect: 'postgres',
  // },

  options: {
    logging: false,
  },
};
