const exp = module.exports;
const dispatcher = require('./dispatcher');
const common = require('./common');
const logger = require('pomelo-logger').getLogger('common');
exp.commonRoute = function (serverType, session, msg, app, cb) {
  var remoteServers = app.getServersByType(serverType);
  if (!remoteServers || remoteServers.length === 0) {
    cb(new Error(`can not find ${serverType} servers`));
    return;
  }
  var uid = session.uid;
  if (!uid) {
    uid = msg.args[0];
  }
  if (!uid) {
    uid = Date.now();
  }
  var res = dispatcher.dispatch(uid.toString(), remoteServers);
  cb(null, res.id);
};


exp.hall = function (session, msg, app, cb) {
  exp.commonRoute('hall', session, msg, app, cb);
};
