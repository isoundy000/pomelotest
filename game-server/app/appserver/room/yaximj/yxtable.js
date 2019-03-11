const pomelo = require('pomelo');
const Promise = require('bluebird');
const TIMER_ID = require('../../../util/common').TIMER_ID;
const common = require('../../../util/common');
const Define = require('../base/commonDefine');
const constData = require('../base/constData');
const api = require('../base/api');
let tagWeaveItem = require('./')
const CJudgeDecorator = require('./JudgeDecorator');
const START_COUNT = 4;
let table = require('../table');
class yxtable extends table {
  constructor() {
    super();
  }
  onGameStart() {
    this.closeTimers();
    this.repositTableFrameSink(true);
    for (let key in this.mapUserInfo) {
      this.mapUserInfo[key].setRun();
      this.mapUserInfo[key].clearUserInfo();
    }
    this.lastOpOutChair = -1;
    this.curChair = -1;
    this.m_cbRepertoryCard = [];

    //初始化
    this.m_cbProvideCard = 0;
    this.m_wProvideUser = -1;
    this.curChair = this.m_wBankerUser;
    this.m_cbHuaPaiCount = [0, 0, 0, 0];
    this.m_cbHuaPaiCardData = [[], [], [], []];
    let vrUserInfo = [];
    
    //设置圈风
    this.m_pJudgeDecorator.SetQuanWind(this.m_nQuanWind);

    //牌总数
    this.m_cbRepertoryCard = constData.deckCardList.slice();

    //洗牌
    for (let i = 0; i < 5; i++) {
      this.m_cbRepertoryCard.sort(function () { return 0.5 - Math.random() });
    }

    //确定混牌

    let index = Math.floor(Math.random()*100.0)% 34;
    this.m_Hun = this.api.SwitchToCardData(index);
    this.m_pJudgeDecorator.SetHun(this.m_Hun);

    //分发 每个玩家13张
    for (let key in this.mapUserInfo) {
      this.mapUserInfo[key].vrHandCard = this.m_cbRepertoryCard.splice(0, 13);
      this.mapUserInfo[key].setBuHua(); // 设置补花
    }

    ////fapai test
    //this.getUserByChair(0).vrHandCard=[0x01,0x01,0x01,0x01,0x02,0x03,0x04,0x05,0x06,0x07,0x08,0x09,0x37];
    //this.getUserByChair(0).vrHandCard=[0x26,0x27,0x28,0x01,0x02,0x03,0x04,0x05,0x06,0x07,0x08,0x09,0x37];
    //this.getUserByChair(0).vrHandCard=[0x01,0x01,0x01,0x01,0x04,0x07,0x12,0x15,0x18,0x23,0x26,0x29,0x37];//zuhelong
    //this.getUserByChair(0).vrHandCard=[0x31,0x32,0x33,0x34,0x31,0x32,0x33,0x34,0x31,0x32,0x33,0x34,0x36];//大四喜
    //this.getUserByChair(0).vrHandCard=[0x35,0x36,0x37,0x35,0x36,0x37,0x35,0x36,0x37,0x21,0x21,0x21,0x19];//大三元
    //this.getUserByChair(0).vrHandCard=[0x12,0x13,0x14,0x12,0x13,0x14,0x12,0x13,0x14,0x16,0x16,0x16,0x18];//绿一色
    //this.getUserByChair(0).vrHandCard=[0x11,0x11,0x11,0x12,0x13,0x14,0x15,0x16,0x17,0x18,0x19,0x19,0x19];//九莲宝灯
    //this.getUserByChair(0).vrHandCard=[0x11,0x11,0x12,0x12,0x13,0x13,0x14,0x14,0x15,0x15,0x16,0x16,0x17];//连七对
    //this.getUserByChair(0).vrHandCard=[0x11,0x19,0x01,0x09,0x21,0x29,0x31,0x32,0x33,0x34,0x35,0x36,0x37];//十三幺
    // this.getUserByChair(0).vrHandCard = [0x01, 0x02, 0x03, 0x12, 0x13, 0x14, 0x23, 0x24, 0x25, 0x14, 0x15, 0x16, 0x26];
    // this.getUserByChair(1).vrHandCard = [0x03, 0x03, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x11, 0x12, 0x13, 0x36];
    // this.getUserByChair(2).vrHandCard = [0x02, 0x02, 0x02, 0x05, 0x05, 0x06, 0x07, 0x08, 0x09, 0x11, 0x12, 0x13, 0x09];
    // this.getUserByChair(3).vrHandCard = [0x33, 0x02, 0x03, 0x04, 0x04, 0x06, 0x07, 0x08, 0x09, 0x11, 0x12, 0x13, 0x36];
    // this.m_cbRepertoryCard = [0x45,
    //   0x36, 0x09, 0x18, 0x17, 0x18, 0x19,						//索子
    //   0x14, 0x15, 0x16, 0x17, 0x18, 0x19,						//索子
    //   0x14, 0x15, 0x16, 0x17, 0x18, 0x19,						//索子
    //   0x14, 0x15, 0x16, 0x17, 0x18, 0x19,						//索子
    //   0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29,						//同子
    //   0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29,						//同子
    //   0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29,						//同子
    //   0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29,						//同子
    //   0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37,									//番子
    //   0x31, 0x32, 0x33, 0x34, 0x35,									//番子
    //   0x31, 0x32, 0x33, 0x34, 0x35,									//番子
    //   0x31, 0x32, 0x33, 0x34, 0x35, 0x37								//番子
    // ];

    //////


    //this.m_cbLeftCardCount = constData.deckCardList.length;

    //设置变量
    this.m_cbProvideCard = 0;
    this.m_wProvideUser = -1;
    for (let i = 0; i < 4; i++) {
      this.m_cbCardIndex[i] = this.getUserByChair(i).vrHandCard;
    }
    ////动作分析
    //let bAroseAction=false;
    //for (let i=0;i<START_COUNT;i++)
    //{
    //    //特殊胡牌
    //    //m_cbUserAction[i]|=m_GameLogic.EstimateChiHu(m_cbCardIndex[i]);
    //    //庄家判断
    //    if (i==this.m_wBankerUser)
    //    {
    //
    //        //杠牌判断
    //        let GangCardResult = new tagGangCardResult();
    //        this.m_cbUserAction[i]|=this.api.AnalyseGangCard(this.SwitchToCardIndex(this.m_cbCardIndex[i]),"",0,GangCardResult);
    //        //胡牌判断
    //        let ChiHuResult=new tagChiHuResult();
    //        this.m_cbUserAction[i]|=this.api.AnalyseChiHuCard(this.SwitchToCardIndex(this.m_cbCardIndex[i]),"",0,0,0,ChiHuResult);
    //    }
    //
    //    //状态设置
    //    if ((bAroseAction==false)&&(i!=this.m_wBankerUser)&&(this.m_cbUserAction[i]!=constData.WIK_NULL))
    //    {
    //        bAroseAction=true;
    //        this.m_wResumeUser=this.curChair;
    //        this.curChair=-1;
    //    }
    //}
    
    ////
    //开始打牌
    //this.setOutCardTime(true);

    //启动补花定时
    this.setBuHuaTime(true, this.buhuaertime, -100, false);
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
      for (let i = 0; i < 4; ++i) {
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
    for (let i = 0; i < START_COUNT; i++) {
      this.m_cbDiscardCount[i] = 0;
    }
    this.m_cbDiscardCard = [];
    this.m_cbDiscardCard = [START_COUNT][55];		//丢弃记录
    //发牌信息
    this.m_tianhumark = true;
    this.m_dihumark = true;
    this.m_cbSendCardData = 0;						//发牌扑克
    this.m_cbSendCardCount = 0;						//发牌数目
    this.m_cbLeftCardCount = 0;						//剩余数目
    this.m_cbRepertoryCard = [];//库存扑克
    for (let i = 0; i < constData.MAX_REPERTORY; i++) {
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
    for (let i = 0; i < START_COUNT; i++) {
      this.m_bEnjoinChiHu[i] = false;
    }

    this.m_bEnjoinChiPeng = [];	//禁止吃碰
    for (let i = 0; i < START_COUNT; i++) {
      this.m_bEnjoinChiPeng[i] = false;
    }

    //用户状态
    this.m_bResponse = [];				//响应标志
    this.m_cbUserAction = [];     //用户动作
    for (let i = 0; i < START_COUNT; i++) {
      this.m_cbUserAction[i] = constData.WIK_NULL;
    }
    this.m_cbOperateCard = [];//操作扑克
    for (let i = 0; i < START_COUNT; i++) {
      this.m_cbOperateCard[i] = 0;
    }
    this.m_cbPerformAction = [];
    for (let i = 0; i < START_COUNT; i++) {
      this.m_cbPerformAction[i] = 0;
    }
    //组合扑克
    this.m_cbWeaveItemCount = [];
    for (let i = 0; i < START_COUNT; i++) {
      this.m_cbWeaveItemCount[i] = 0;
    }
    this.m_WeaveItemArray = [];//组合扑克
    for (let i = 0; i < 4; i++) {
      this.m_WeaveItemArray[i] = [];
      for (let j = 0; j < 4; j++) {
        this.m_WeaveItemArray[i][j] = new api.tagWeaveItem();
      }

    }
    //结束信息
    this.m_cbChiHuCard = 0;							//吃胡扑克
    this.m_ChiHuResult = [];				//吃胡结果
    for (let j = 0; j < 4; j++) {
      this.m_ChiHuResult[j] = new api.tagChiHuResult();
    }
    this.m_pJudgeDecorator = new CJudgeDecorator(Define.RULE_PUBLIC);
    this.m_pJudgeDecorator.Init();
    /////////////////////////////////////
  }
  
}