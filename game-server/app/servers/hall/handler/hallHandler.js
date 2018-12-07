const Promise = require('bluebird');
const pomelo = require('pomelo');
let baseUser = require('../../../appserver/base/baseUser');
const logger = require('pomelo-logger').getLogger('common');

class HallHandler{
	constructor() {}
	enterHall(msg, session, next) {
		if (!session.uid) {
			return next(null, { code: 500});
		}
		pomelo.app.service.enterHall(session)
	}
}