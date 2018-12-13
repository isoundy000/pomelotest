const Promise = require('bluebird');
const pomelo = require('pomelo');
let baseUser = require('../../../appserver/base/baseUser');
const logger = require('pomelo-logger').getLogger('common');

class RoomHandler{
	constructor() {
		this.mapUid = {}; // 玩家uid操作记录
	}
	enterRoom(msg, session, next) {
		if (!session.uid) {
			return next(null, { code: 500 });
		}
		if (msg.roomId == undefined || !pomelo.app.service.rooms[msg.roomId]) {
			return next(null, { code: -500, msg: '参数错误' });
		}
		if (pomelo.app.service.mapUserTable[session.uid]) {
			// 已经在桌子上了
			return next(null, { code: 500 });
		}
	}
}
module.exports = new RoomHandler();