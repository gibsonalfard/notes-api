const redis = require('redis');

class Cache {
  constructor() {
    this.client = redis.createClient({
      socket: {
        host: process.env.REDIS_SERVER,
        port: process.env.REDIS_PORT,
      },
    });
    this.client.on('error', (error) => {
      console.error(error);
    });
    this.client.connect();
  }

  async set(key, value, expirationInSecond = 3600) {
    await this.client.set(key, value, {
      EX: expirationInSecond,
    });
  }

  async get(key) {
    const cache = await this.client.get(key);
    return cache;
  }

  async delete(key) {
    return this.client.del(key);
  }
}

module.exports = Cache;
