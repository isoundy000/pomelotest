const IORedis = require("ioredis");
const gameConfig = require("../../../config/configuration");
const logger = require('pomelo-logger').getLogger('redis');
Redis = function () { };
module.exports = Redis;
let app = null;

Redis.initAll = function (pomeloApp) {
  let redisDB = gameConfig.redis.db;
  app = pomeloApp;

  for (let key in redisDB) {
    Redis.init(key, redisDB[key], gameConfig.redis);
  }
}

Redis.init = function (key, db, redisConfig) {
  let currentRedis = new IORedis({
    port: 6379, // Redis port
    host: redisConfig.url, // Redis host
    family: 4, // 4 (IPv4) or 6 (IPv6)
    password: redisConfig.password,
    db
  });

  app[key] = currentRedis;
  currentRedis.on("error", function (error) {
    if (error) {
      logger.error('redis error', error);
    }
  });

  currentRedis.on("connect", async function () {
    if ((db != redisConfig.db.userRedis) && app.serverId == 'hall-1') { //在配置redis片中初始化信息
      await currentRedis.flushdb();
    }
  });
}
