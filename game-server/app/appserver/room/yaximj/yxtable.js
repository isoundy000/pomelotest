const pomelo = require('pomelo');
const Promise = require('bluebird');
const TIMER_ID = require('../../../util/common').TIMER_ID;
const common = require('../../../util/common');
let table = require('../table');
class yxtable extends table {
  constructor() {
    super();
  }
  onGameStart() {
    this.closeTimers();
    for (let key in this.mapUserInfo) {
      this.mapUserInfo[key].setRun();
      this.mapUserInfo[key].clearUserInfo();
    }
  }
}