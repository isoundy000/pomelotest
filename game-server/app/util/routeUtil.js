const exp = module.exports;
const dispatcher = require('./dispatcher');
const pomelo = require("pomelo");
const common = require('./common');
const logger = require('pomelo-logger').getLogger('common');
let roomIdMap = {};
exp.init = function () {
  return pomelo.app.db.room.findAll({
    where: { visual: 1 },
    attributes: ['id', 'serverId']
  })
    .then((result) => {
      for (let i = 0; i < result.length; i++){
        roomIdMap[result[i].id] = result[i].serverId;
      }
    })
}
exp.commonRoute = function (serverType, session, msg, app, cb) {
  var servers = app.getServersByType(serverType);
  var uid = session.uid;
  var res = dispatcher.dispatch(uid.toString(), servers);
  cb(null, res.id);
};


exp.hall = function (session, msg, app, cb) {
  if (!session.uid) {
    return cb(new Error(`can not find ${session.uid}`));
  }
  exp.commonRoute('hall', session, msg, app, cb);
};

exp.room = function (session, msg, app, cb) {
  if (!session.uid) {
    return cb(new Error(`can not find ${session.uid}`));
  }
  if (msg.roomId && roomIdMap[msg.roomId]) {
    return cb(null, roomIdMap[msg.roomId]);
  }
  pomelo.app.redis.userStatus.hget(session.uid, "gameServerId")
    .then((result) => {
      if (result) {
        return cb(null, result);
      }
      return Promise.reject("userStatus gameServerId null");
    })
    .catch((error) => {
      logger.error('exp.room error', error);
      return cb(new Error(`exp.room error`));
  })
};
