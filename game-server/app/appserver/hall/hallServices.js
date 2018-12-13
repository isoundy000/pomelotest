const pomelo = require('pomelo');
const baseUser = require("../base/baseUser");
const Promise = require('bluebird');
class hallServices {
  constructor() {

  }
  enterHall(session) {
    let room = null;
    return pomelo.app.db.room.findAll({
      where: { visual: 1 },
      attributes: ['id', 'name', 'desc']
    })
      .then((result) => {
        room = result;
        return pomelo.app.db.user.findOne({
          where: { uid: session.uid }
        });
      })
      .then((result) => {
        let user = new baseUser();
        return Promise.resolve({ room, user });
      })
  }
}
module.exports = new hallServices();