const pomelo = require('pomelo');
const Promise = require('bluebird');
const TIMER_ID = require('../../../util/common').TIMER_ID;
const common = require('../../../util/common');
const Define = require('../base/commonDefine');
const constData = require('../base/constData');
const api = require('../base/api');
let tagWeaveItem = require('./')
const CJudgeDecorator = require('./JudgeDecorator');
const FKMJ_START_COUNT = 4;
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

  /**
   * 复位桌子
   * @param {*} iscontinue
   */
  repositTableFrameSink(iscontinue) {
    //游戏变量
    this.m_cbFinishBuHuaCount = 0;
    this.m_wSiceCount = [-1, -1];							//骰子点数
    if (undefined == iscontinue || !iscontinue) {
      for (var i = 0; i < 4; ++i) {
        this.m_nMenWind[i] = i;
      }
      this.m_wBankerUser = 0;							//庄家用户
      this.m_nQuanWind = Define.WIND_EAST;
    }
    this.m_lGameScore = [];				//游戏得分
    this.m_cbCardIndex = [];	//用户扑克
    //出牌信息
    this.m_wOutCardUser = "";							//出牌用户
    this.m_cbOutCardData = 0;						//出牌扑克
    this.m_cbOutCardCount = 0;						//出牌数目
    this.m_cbDiscardCount = [];			//丢弃数目
    for (var i = 0; i < FKMJ_START_COUNT; i++) {
      this.m_cbDiscardCount[i] = 0;
    }
    this.m_cbDiscardCard = [];
    this.m_cbDiscardCard = [FKMJ_START_COUNT][55];		//丢弃记录
    //发牌信息
    this.m_tianhumark = true;
    this.m_dihumark = true;
    this.m_cbSendCardData = 0;						//发牌扑克
    this.m_cbSendCardCount = 0;						//发牌数目
    this.m_cbLeftCardCount = 0;						//剩余数目
    this.m_cbRepertoryCard = [];//库存扑克
    for (var i = 0; i < constData.MAX_REPERTORY; i++) {
      this.m_cbRepertoryCard[i] = 0;
    }

    //运行变量
    this.m_cbProvideCard = 0;                         //供应扑克
    this.m_wResumeUser = -1;                          //还原用户
    this.m_wProvideUser = -1;                         //供应用户
    //状态变量
    this.m_bSendStatus = false;							//发牌状态
    this.m_bGangStatus = false;							//抢杆状态
    this.m_bEnjoinChiHu = [];//禁止吃胡
    for (var i = 0; i < FKMJ_START_COUNT; i++) {
      this.m_bEnjoinChiHu[i] = false;
    }

    this.m_bEnjoinChiPeng = [];	//禁止吃碰
    for (var i = 0; i < FKMJ_START_COUNT; i++) {
      this.m_bEnjoinChiPeng[i] = false;
    }

    //用户状态
    this.m_bResponse = [];				//响应标志
    this.m_cbUserAction = [];     //用户动作
    for (var i = 0; i < FKMJ_START_COUNT; i++) {
      this.m_cbUserAction[i] = constData.WIK_NULL;
    }
    this.m_cbOperateCard = [];//操作扑克
    for (var i = 0; i < FKMJ_START_COUNT; i++) {
      this.m_cbOperateCard[i] = 0;
    }
    this.m_cbPerformAction = [];
    for (var i = 0; i < FKMJ_START_COUNT; i++) {
      this.m_cbPerformAction[i] = 0;
    }
    //组合扑克
    this.m_cbWeaveItemCount = [];
    for (var i = 0; i < FKMJ_START_COUNT; i++) {
      this.m_cbWeaveItemCount[i] = 0;
    }
    this.m_WeaveItemArray = [];//组合扑克
    for (var i = 0; i < 4; i++) {
      this.m_WeaveItemArray[i] = [];
      for (var j = 0; j < 4; j++) {
        this.m_WeaveItemArray[i][j] = new api.tagWeaveItem();
      }

    }
    //结束信息
    this.m_cbChiHuCard = 0;							//吃胡扑克
    this.m_ChiHuResult = [];				//吃胡结果
    for (var j = 0; j < 4; j++) {
      this.m_ChiHuResult[j] = new api.tagChiHuResult();
    }
    this.m_pJudgeDecorator = new CJudgeDecorator(Define.RULE_PUBLIC);
    this.m_pJudgeDecorator.Init();
    /////////////////////////////////////
    return;
  }

}