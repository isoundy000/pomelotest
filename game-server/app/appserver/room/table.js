const pomelo = require('pomelo');
const baseUser = require("../base/baseUser");
const Promise = require('bluebird');
class table {
  constructor() {
    this.mapUserInfo = {};
  }
  init(tableIdx, roomInfo) {
    this.tableIdx = tableIdx;
    let info = JSON.parse(roomInfo.info);
    this.outTime = info.outTime || 30;
    this.readyTime = info.readyTime || 30;
    this.baseBean = info.baseBean || 10;
    this.enterLimit = info.enterLimit || 0;
    this.fee = info.fee || this.baseBean;
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
    let tableinfo = getBasicTableInfo(user.uid);
    return Promise.resolve({ code: 200, msg: tableinfo });
  }

  /**
   * 获取桌上人数
   */
  getUserCount() {
    return Object.keys(this.mapUserInfo).length;
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

  getBasicTableInfo(uid) {
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
}
module.exports = table;