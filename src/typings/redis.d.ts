import Redis from 'redis';

type stringOrNum = string | number;

declare module 'redis' {
  interface RedisClient {
    getAsync: (key: string) => Promise<string>;

    hgetAsync: (key: string, field: string) => Promise<string>;

    setAsync: (key: string, value: string, ...args: stringOrNum[]) => Promise<'OK'>;

    hsetAsync: (key: string, field: string, value: string) => Promise<number>;

    hdelAsync: (key: string, field: string) => Promise<Redis.OverloadedKeyCommand<string, number, boolean>>;
  }
}