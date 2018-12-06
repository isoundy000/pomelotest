const Promise = require('bluebird');
const pomelo = require('pomelo');
const errorjson = require('../../../../config/errorcode');
const logger = require('pomelo-logger').getLogger('connect');
module.exports = function (app) {
	return new Handler(app);
};

var Handler = function (app) {
	this.app = app;
};

/**
 * New client entry.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.entry = function (msg, session, next) {
	next(null, { code: 200, msg: 'game server is ok.' });
};

/**
 * Publish route for mqtt connector.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.publish = function (msg, session, next) {
	var result = {
		topic: 'publish',
		payload: JSON.stringify({ code: 200, msg: 'publish message is ok.' })
	};
	next(null, result);
};

/**
 * Subscribe route for mqtt connector.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.subscribe = function (msg, session, next) {
	var result = {
		topic: 'subscribe',
		payload: JSON.stringify({ code: 200, msg: 'subscribe message is ok.' })
	};
	next(null, result);
};

Handler.prototype.login = function (msg, session, next) {
	if (!msg.mobile || !msg.password) {
		return next(null, { code: 10001, msg: errorjson['10001'] });
	}
	return pomelo.app.db.findOne({ where: { mobile: msg.mobile } })
		.then((result) => {
			if (!result) {
				return Promise.reject({ code: 10002, msg: errorjson['10002'] });
			}
			if (result.password != msg.password) {
				return Promise.reject({ code: 10004, msg: errorjson['10004'] });
			}
		})
		.catch((error) => {
			logger.error(`Handler.prototype.login error`, error);
			error.code = error.code || 10003;
			error.msg = error.msg || errorjson['10003'];
			next(null, { code: error.code, msg: error.msg });
		})
};

