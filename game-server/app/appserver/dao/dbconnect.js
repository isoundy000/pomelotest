const Sequelize = require('sequelize');
const pomelo = require('pomelo');
let userdb = require('./dbconfig/user');
let roomdb = require('./dbconfig/room');
const mysqlconf = require("../../../config/configuration").mysql;
class dbconnect {
  constructor() {
    this.sequelize = null; // 数据库连接池
    this.user = null; // 用户表 
    this.record = null;
    this.room = null; // 房间表
  }
  initConnect() {
    this.sequelize = new Sequelize(mysqlconf.database, mysqlconf.user, mysqlconf.password, {
      host: mysqlconf.host,
      timezone: '+08:00',
      dialect: 'mysql',
      pool: {
        max: 5,
        min: 0,
        idle: 10000
      }
    });
    this.initUser();
    this.initRoom();
  }
  initUser() {
    this.user = userdb(this.sequelize, Sequelize);
    let condication = {
      force: false,
    }
    if ('connector-1' == pomelo.createApp.serverId) {
      condication = {
        force: false, // 表创建前先删除原始表
        alter: true //表建好了现在需要修改表字段
      }
    }
    this.user.sync(condication) // alter
      .then(() => {
        // 已创建数据表
        return this.user.create({
          nick: 'J1ohn5',
          mobile: null,
        });
      });
  }
  initRoom() {
    this.room = roomdb(this.sequelize, Sequelize);
    this.room.sync({
        force: false,
        //alter: true //表建好了现在需要修改表字段
      }) // alter
      // .then(() => {
      //   return this.room.findOne({
      //     where: {
      //       id: 1
      //     }
      //   });
      // })
      // .then((result) => {
      //   result.name = pomelo.app.serverId;
      //   return result.save();
      // })
      // .then(result => {
      //   console.log(result)
      // })
      .catch((error) => {
        console.log("error--", error)
      })
  }
}
module.exports = new dbconnect();