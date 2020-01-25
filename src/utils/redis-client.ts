import redis from 'redis';
import { promisify } from 'util';

const client = redis.createClient();

client.getAsync = promisify(client.get).bind(client);

client.hgetAsync = promisify(client.hget).bind(client);

client.setAsync = promisify(client.set).bind(client);

client.hsetAsync = promisify(client.hset).bind(client);

client.hdelAsync = promisify(client.hdel).bind(client);

export default client;
