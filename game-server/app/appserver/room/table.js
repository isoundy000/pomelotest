const pomelo = require('pomelo');
const Promise = require('bluebird');
const TIMER_ID = require('../../util/common').TIMER_ID;
const common = require('../../util/common');
class table {
  constructor() {
  }
  init(tableIdx, roomInfo) {
    this.tableIdx = tableIdx;
    let info = JSON.parse(roomInfo.info);
    this.outTime = info.outTime || 30;
    this.readyTime = info.readyTime || 30;
    this.baseBean = info.baseBean || 10;
    this.enterLimit = info.enterLimit || 0;
    this.fee = info.fee || this.baseBean;
    this.roomId = roomInfo.id;
    this.timerNameReady = `timerNameReady${this.roomId}_${tableIdx}_${pomelo.app.serverId}`;
    this.timerNameOutCard = `timerNameOutCard${this.roomId}_${tableIdx}_${pomelo.app.serverId}`;
    this.timerNameTrustee = `timerNameTrustee${this.roomId}_${tableIdx}_${pomelo.app.serverId}`;
    this.timerNameOffline = `timerNameOffline${this.roomId}_${tableIdx}_${pomelo.app.serverId}`;
    this.timerNameEndToContinue = `timerNameEndToContinue${this.roomId}_${tableIdx}_${pomelo.app.serverId}`;
    this.timerDelayCleanEnd = `timerDelayCleanEnd${this.roomId}_${tableIdx}_${pomelo.app.serverId}`;
    let nowtime = new Date().getTime();
    this.channel = pomelo.app.get('channelService').getChannel(`room_${this.roomId}_table_${this.tableIdx}_${nowtime}`, true);
    this.unreadyKickTime = {};
    this.mapUserInfo = {};
    this.clockTime = 0;
  }
  /**
   * 玩家上座
   * @param {*} chair 椅子
   * @param {*} user  用户信息
   */
  enterTable(chair, user) {
    if (this.getUserCount() >= 4 || this.getUserByChair(chair)) {
      return Promise.reject(new Error({ code: -500, msg: '座位上已有人了' }));
    }
    if (user.bean < this.enterLimit) {
      return Promise.reject(new Error({ code: -500, msg: `本桌准入标准是${this.enterLimit}钻石,请先去商城兑换` }));
    }
    user.chair = chair;
    this.mapUserInfo[user.uid] = user;
    let tableinfo = this.getEnterTableInfo(user.uid);
    this.tellOthersSomeOneIn(user);
    common.addToChannel(this.channel, user.uid, user.sid);
    return Promise.resolve(tableinfo);
  }

  /**
   * 某人上座后告诉桌上玩家和房间内玩家他上了哪个座位
   * @param {*} user 
   */
  tellOthersSomeOneIn(user) {
    let userInfo = user.getPlayInfo();
    this.channel.pushMessage('onPlayerIn', { userInfo }); // 给桌上的玩家推送玩家上座消息
    let baseInfo = { tableIdx: this.tableIdx, chair: user.chair, role: user.role, role: user.nick, roomId: this.roomId };
    pomelo.app.service.tellOthersSomeOneToTalbe(this.roomId, baseInfo);
  }

  /**
   * 某人离开座位后告诉桌上玩家和房间内玩家
   * @param {*} user 
   */
  tellOthersSomeOneOut(uid) {
    this.channel.pushMessage('onPlayerOut', { uid, roomId: this.roomId }); // 给桌上的玩家推送玩家离开消息
    let baseInfo = { tableIdx: this.tableIdx, uid, roomId: this.roomId };
    pomelo.app.service.tellOthersSomeOneLeaveTalbe(this.roomId, baseInfo);
  }

  /**
   * 某人离开桌子
   * @param {*} uid 
   */
  leaveTable(uid) {
    let user = this.mapUserInfo[uid];
    if (user && !user.isPlaying()) {
      this.tellOthersSomeOneOut(uid);
      common.leaveChannel(this.channel, user.uid);
      delete this.mapUserInfo[uid];
      delete pomelo.app.service.mapUserTable[uid];
    }
    // 有人离开需要清理桌子
    this.closeTimer(TIMER_ID.ID_READY, uid);
    this.closeTimer(TIMER_ID.ID_OFFLINE_KCIK, uid);
  }

  /**
   * 获取桌上人数
   */
  getUserCount() {
    return Object.keys(this.mapUserInfo).length;
  }

  /**
   * 获取准备人数
   */
  getReadyCount() {
    let count = 0;
    for (let key in this.mapUserInfo) {
      if (this.mapUserInfo[key].isReady()) {
        count++;
      }
    }
    return count;
  }

  /**
   * 通过椅子号查找玩家
   * @param {*} chair 
   */
  getUserByChair(chair) {
    for (let key in this.mapUserInfo) {
      if (this.mapUserInfo[key].chair == chair) {
        return this.mapUserInfo[key];
      }
    }
    return null;
  }

  /**
   * 获取桌子简要信息
   */
  getBasicTableInfo() {
    let info = {
      tableIdx: this.tableIdx,
      enterLimit: this.enterLimit,
      baseBean: this.baseBean,
      mapUserInfo: {}
    }
    for (let key in this.mapUserInfo) {
      info.mapUserInfo["role"] = this.mapUserInfo["role"];
      info.mapUserInfo["nick"] = this.mapUserInfo["nick"];
      info.mapUserInfo["chair"] = this.mapUserInfo["chair"];
    }
    return info;
  }

  /**
   * 玩家上座获取桌子基础信息
   */
  getEnterTableInfo(uid) {
    let info = {
      tableIdx: this.tableIdx,
      outTime: this.outTime,
      readyTime: this.readyTime,
      baseBean: this.baseBean,
      fee: this.fee,
      mapUserInfo: {}
    }
    for (let key in this.mapUserInfo) {
      info.mapUserInfo[key] = this.mapUserInfo[key].getPlayInfo(uid);
    }
    return info;
  }

  /**
  * 启动定时器
  * @param {Number} timerId	定时器ID
  * @param {Number} uid 用户ID
  */
  startTimer(timerId, uid = 0) {
    let self = this;
    switch (timerId) {
      case TIMER_ID.ID_OUT_CARD: // 出牌定时器
        this.clockTime = new Date().getTime() + this.outTime * 1000;
        common.setGameTimeout(this.timerNameOutCard, (this.outTime + 1) * 1000, () => {
        });
        break;
      case TIMER_ID.ID_TRUSTEE: // 托管延时操作定时器
        common.setGameTimeout(this.timerNameTrustee, 1000, () => {
        });
        break;
      case TIMER_ID.ID_READY: // 准备倒计时
        let tmpTimerName = this.timerNameReady + uid;
        this.unreadyKickTime[uid] = new Date().getTime();
        common.setGameTimeout(tmpTimerName, (this.readyTime + 1) * 1000, () => {
          let user = this.mapUserInfo[uid];
          if (user && user.isFree()) {
            this.leaveTable(user.uid);
          }
        });
        break;
      case TIMER_ID.ID_OFFLINE_KCIK: // 掉线提出定时器
        let timerNameOffline = this.timerNameOffline + uid;
        common.setGameTimeout(timerNameOffline, 3 * 60 * 1000, () => {
          let user = this.mapUserInfo[uid];
          if (user && !user.online && !user.isPlaying()) {
            let uid = user.uid;
            this.leaveTable(uid);
            pomelo.app.service.leaveRoom(this.roomId, uid);
          }
        });
        break;
      case TIMER_ID.END_TO_CONTINUE: // 一局结束到下一句开始
        common.setGameTimeout(this.timerNameEndToContinue, 35 * 1000, () => {
        });
        break;
      case TIMER_ID.DELAY_TO_CLEANEND: // 一局结束延时清理结算
        common.setGameTimeout(this.timerDelayCleanEnd, 100, () => {
        });
        break;
    }
  };

  /**
   * 关闭定时器
   */
  closeTimers() {
    for (let key in this.mapUserInfo) {
      this.closeTimer(TIMER_ID.ID_READY, key);
      this.closeTimer(TIMER_ID.ID_OFFLINE_KCIK, key);
    }
    this.closeTimer(TIMER_ID.ID_TRUSTEE);
    this.closeTimer(TIMER_ID.ID_OUT_CARD);
    this.closeTimer(TIMER_ID.ID_END_TO_CONTINUE);
    this.closeTimer(TIMER_ID.ID_FIRST_OUT_CARD);
    this.closeTimer(TIMER_ID.ID_DELAY_TO_CLEANEND);
  }

  /**
   * 关闭定时器
   * @param {Number} timerId		定时器Id
   * @param {Number} uid    玩家ID
   */
  closeTimer(timerId, uid) {
    switch (timerId) {
      case TIMER_ID.ID_TRUSTEE: // 托管
        common.clearGameTimeout(this.timerNameTrustee);
        break;
      case TIMER_ID.ID_READY: // 准备定时器
        if (this.unreadyKickTime[uid]) {
          delete this.unreadyKickTime[uid]
        };
        common.clearGameTimeout(this.timerNameReady + uid);
        break;
      case TIMER_ID.ID_OUT_CARD: // 出牌
        this.clockTime = 0;
        common.clearGameTimeout(this.timerNameOutCard);
        break;
      case TIMER_ID.ID_OFFLINE_KCIK: // 掉线清理定时器
        common.clearGameTimeout(this.timerNameOffline + uid);
        break;
      case TIMER_ID.ID_END_TO_CONTINUE: // 一局结束到自动开始定时器
        this.clockTime = 0;
        common.clearGameTimeout(this.timerNameEndToContinue);
        break;
      case TIMER_ID.ID_DELAY_TO_CLEANEND: // 一局结束延时清理结算
        this.clockTime = 0;
        common.clearGameTimeout(this.timerDelayCleanEnd);
        break;
    }
  }

  /**
   * 当前是否可以离开桌子
   */
  canLeave() {
    if (this.getUserCount() < 4) {
      return true;
    }
    for (let key in this.mapUserInfo) {
      if (this.mapUserInfo[key].isPlaying()) {
        return false;
      }
    }
    return true;
  }

  /**
   * 桌上玩家准备
   * @param {*} uid 
   */
  onReady(uid, cb) {
    this.closeTimer(TIMER_ID.ID_READY, uid);
    let user = this.mapUserInfo[uid];
    if (user.isReady()) {
      return cb({ code: 200 });
    }
    if (user.isPlaying()) {
      return cb({ code: 500 });
    }
    user.setReady();
    this.channel.pushMessage('onReady', { uid }); // 给桌上的玩家推送玩家准备消息
    cb({ code: 200 });
    this.checkStart();
  }

  /**
   * 检查是否可以开始
   */
  checkStart() {
    if (this.getReadyCount() == 4) {
      this.onGameStart();
    }
  }
  
  onGameStart() {
    this.closeTimers();
    for (let key in this.mapUserInfo) {
      this.mapUserInfo[key].setRun();
      this.mapUserInfo[key].clearUserInfo();
    }
  }
}
module.exports = table;