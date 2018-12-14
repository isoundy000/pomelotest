let baseUser = require('../base/baseUser');
let gameState = require('../../util/common').GAMESTATE;
class user extends baseUser{
  constructor() {
    super();
    this.trust = false;
    this.online = false;
    this.state = gameState.FREE;
    this.sid = null;
  };

  /**
   * 初始化玩家信息
   * @param {*} dbuser 
   */
  initUser(dbuser) {
    for (let key in this) {
      if (dbuser[key]) {
        this[key] = dbuser[key];
      }
    }
  };

  /**
   * 清理玩家信息
   */
  clearUserInfo() {
    this.outCards = [];
    this.operator = [];
    this.cards = [];
  };

  /**
   * 进桌获取玩家信息
   * @param {*} uid 
   */
  getPlayInfo(uid = null) {
    return {
      uid: this.uid,
      nick: this.nick,
      role: this.role,
      bean: this.bean,
      sex: this.sex,
      trust: this.trust,
      online: this.online,
      chair: this.chair,
      outCards: this.outCards,
      operator: this.operator,
      cards: (this.uid == uid ? this.cards : [])
    }
  }

  /**
   * 是否在游戏中
   */
  isPlaying() {
    if (this.state == gameState.RUN) {
      return true;
    }
    return false;
  }
  setRun() {
    this.state = gameState.RUN;
  }
  /**
   * 自由状态
   */
  isFree() {
    if (this.state == gameState.FREE) {
      return true;
    }
    return false;
  }
  setFree() {
    this.state = gameState.FREE;
  }
  /**
   * 准备状态
   */
  isReady() {
    if (this.state == gameState.READY) {
      return true;
    }
    return false;
  }
  setReady() {
    this.state = gameState.READY;
  }
}