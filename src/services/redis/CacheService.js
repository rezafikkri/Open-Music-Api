const redis = require('redis');

class CacheService {
  constructor() {
    this.client = redis.createClient({
      host: process.env.REDIS_SERVER,
    });

    this.client.on('error', (error) => {
      console.log(error);
    });
  }

  set(key, value, exporationInSecond = 3600) {
    return new Promise((resolve, reject) => {
      this.client.set(key, value, 'EX', exporationInSecond, (error, ok) => {
        if (error) {
          reject(error);
        } else {
          resolve(ok);
        }
      });
    });
  }

  get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (error, reply) => {
        if (error) {
          reject(error);
        } else if (reply === null) {
          reject(new Error('Cache tidak ditemukan'));
        } else {
          resolve(reply);
        }
      });
    });
  }

  delete(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (error, count) => {
        if (error) {
          reject(error);
        } else {
          resolve(count);
        }
      });
    });
  }
}

module.exports = CacheService;
