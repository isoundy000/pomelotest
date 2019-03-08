const exp = module.exports;
const Promise = require('bluebird');
/**
 * 创建Promise
 * @param {class} target 
 * @param {Function} fun 
 */
exp.createPromise = function (target, fun) {
  let args = Array.prototype.slice.call(arguments, 2);
  return new Promise(function (resolve, reject) {

    args.push(function (err, result) {
      let cbArgs = Array.prototype.slice.call(arguments);
      if (cbArgs.length == 1) {
        result = err;
        err = null;
      }

      if (err)
        reject(err);
      else
        resolve(result);
    });
    fun.apply(target, args);
  })
};

/// 定时器相关
exp.timers = {};
/**
 * 判断定时器是否超时
 * @param {string} name			定时器名
 * @returns {boolean}				是否超时
 */
exp.isGameTimeout = function (name) {
  return exp.timers[name] !== undefined;
};
/**
 * 设置超时定时器
 * @param {string} name		定时器名
 * @param {number} time		定时时间（毫秒）
 * @param {function} cb		回调函数
 */
exp.setGameTimeout = function (name, time, cb) {
  // 删除超时定时器
  exp.clearGameTimeout(name);

  // 分离参数
  let args = Array.prototype.slice.call(arguments);
  args.splice(0, 3);

  // 保存定时器Id
  exp.timers[name] = setTimeout(function (args) {
    if (exp.timers[name] !== undefined) {
      delete exp.timers[name];
      cb(...args);
    }
  }, time, args);

  exp.timers[name].callback = cb;
  exp.timers[name].totalTime = time;
  exp.timers[name].startTime = Date.now();
};

/**
 * 设置间隔定时器
 * @param {string} name		定时器名
 * @param {number} time		定时时间（毫秒）
 * @param {function} cb		回调函数
 */
exp.setGameInterval = function (name, time, cb) {
  // 删除间隔定时器
  exp.clearGameInterval(name);

  // 分离参数
  let args = Array.prototype.slice.call(arguments);
  args.splice(0, 3);

  // 保存定时器Id
  exp.timers[name] = setInterval(function () {
    if (exp.timers[name] === undefined) {
      delete exp.timers[name];
    }
    else {
      cb(...args);
    }
  }, time);
};

/**
 * 清除超时定时器
 * @param {string} name		定时器名
 */
exp.clearGameTimeout = function (name) {
  if (exp.timers[name] !== undefined) {
    clearTimeout(exp.timers[name]);
    delete exp.timers[name];
  }
};

/**
 * 清除间隔定时器
 * @param {string} name		定时器名
 */
exp.clearGameInterval = function (name) {
  if (exp.timers[name] !== undefined) {
    clearInterval(exp.timers[name]);
    delete exp.timers[name];
  }
};


exp.getRandomString = function (len, onlyNum) {
  len = len || 32;
  var $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnoprstuvwxyz0123456789';
  if (onlyNum) {
    $chars = '0123456789';
  }

  var maxPos = $chars.length;
  var str = '';
  for (var i = 0; i < len; i++) {
    str += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return str;
}

exp.generateSession = function (uid, sid) {
  let session = {};
  session.uid = uid;
  session.get = function () {
    return sid;
  }
  return session;
}

exp.addToChannel = function (channel, uid, sid) {
  if (typeof uid != 'number') {
    uid = parseInt(uid);
  }
  let member = channel.getMember(uid);
  if (member) {
    channel.leave(member.uid, member.sid);
  }
  channel.add(uid, sid);
}

exp.leaveChannel = function (channel, uid) {
  if (typeof uid != 'number') {
    uid = parseInt(uid);
  }
  let member = channel.getMember(uid);
  if (member) {
    channel.leave(member.uid, member.sid);
  }
}

// 定时器ID
exp.TIMER_ID = {
  ID_READY: 1,								// 准备定时器
  ID_OUT_CARD: 2,						  // 出牌定时器
  ID_TRUSTEE: 3,							// 托管定时器
  ID_OFFLINE_KCIK: 4,         //掉线一段时间后踢出定时器
  ID_END_TO_CONTINUE: 5,      //一局结束到下一句开始定时器
  ID_DELAY_TO_CLEANEND: 6,    //一局结束延时清理结算
  ID_BUHUA: 7,                //补花定时器
};

// 游戏状态
exp.GAMESTATE = {
  FREE:0,                 // 非游戏状态
  READY: 1,								// 准备状态
  RUN: 2,						      // 游戏状态
  BUHUA: 4                //补花阶段
};