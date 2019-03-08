let baseInfo = [
  "uid", "nick", "score", "win", "lose", "role", "gold", "bean", "sex", "mobile"
];
class baseUser {
  constructor() {
    this.uid = null;
    this.nick = "";
    this.chair = -1;
    this.score = 0;
    this.win = 0;
    this.lose = 0;
    this.role = '0';
    this.gold = 0;
    this.bean = 0;
    this.sex = 0;
    this.mobile = "";
  };
  getBaseInfo(user) {
    let userInfo = {};
    for (let i = 0; i < baseInfo.length; i++){
      userInfo[baseInfo[i]] = user[baseInfo[i]];
    }
    return userInfo;
  }
}
module.exports = baseUser; 