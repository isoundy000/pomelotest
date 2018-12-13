let baseUser = require('../base/baseUser');
class user extends baseUser{
  constructor() {
    super();
    this.trust = false;
    this.online = false;
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
  getPlayInfo(uid) {
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
}