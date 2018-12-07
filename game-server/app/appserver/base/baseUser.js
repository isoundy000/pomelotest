class baseUser {
  constructor() {
    this.baseInfo = [
      "uid", "nick", "score", "win", "lose", "role", "gold", "bean", "sex", "mobile"
    ]
  };
  getBaseInfo(user) {
    let userInfo = {};
    for (let i = 0; i < this.baseInfo.length; i++){
      userInfo[this.baseInfo[i]] = user[this.baseInfo[i]];
    }
    return userInfo;
  }
}
module.exports = baseUser; 