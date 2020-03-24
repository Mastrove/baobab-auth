import config from '../config/database';
const env = process.env.NODE_ENV || 'development';

export default (organizationName = process.env.DATABASE_NAME): string => `${config[env].databaseUrl}/${organizationName}`;
