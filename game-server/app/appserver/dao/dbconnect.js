var Sequelize = require('sequelize');
let userdb = require('./dbconfig/user');
class dbconnect {
  constructor() {
    this.sequelize = null; // 数据库连接池
    this.user = null; // 用户表 
    this.record = null;
  }
  initConnect() {
    this.sequelize = new Sequelize('pomelotest', 'root', null, {
      host: 'localhost',
      dialect: 'mysql',
      pool: {
        max: 5,
        min: 0,
        idle: 10000
      }
    });
    this.initUser();
  }
  initUser() {
    this.user = userdb(this.sequelize, Sequelize);
    this.user.sync({
        force: false
      }) // alter
      .then(() => {
        // // 已创建数据表
        // return this.user.create({
        //   nick: 'J1ohn5',
        //   mobile:null,
        // });
      });
  }
}
module.exports = new dbconnect();