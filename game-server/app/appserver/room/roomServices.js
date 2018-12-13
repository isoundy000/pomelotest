const pomelo = require('pomelo');
const baseUser = require("../base/baseUser");
const Promise = require('bluebird');
const basetable = require('./table');
class RoomServices {
  constructor() {
    this.rooms = {};  // 房间列表
    this.mapUserTable = {}; // 房间内用户与桌子map
  }
  initRoom() {
    pomelo.app.db.room.findAll({
      where: { visual: 1, serverId:pomelo.app.serverId}
    })
      .then((result) => {
        for (let i = 0; i < result.length; i++){
          this.createTables(result[i]);
        }
    })
  }
  createTables(roomInfo) {
    this.rooms[roomInfo.id] = [];
    for (let i = 0; i < roomInfo.tableCount; i++){
      let table = new basetable();
      table.init(i, roomInfo);
      this.rooms[roomInfo.id].push(table);
    }
  }
}
module.exports = new RoomServices();