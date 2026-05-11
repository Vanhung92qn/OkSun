/**
 * Thong tin phien
 */
//fix by Telegram: @sharkdn Chuyên cung cấp mã nguồn sàn BO, viết game Casino, fix game, viết WEBSITE

var taiXiuConfig = require('TaiXiuConfig');
import Utils from "../../../scripts/shootFish/common/Utils";
import Tween from "../../../scripts/shootFish/common/Tween";
var helper = require('Helper');
(function () {
    cc.TaiXiuInfoView = cc.Class({
        "extends": cc.Component,
        properties: {
            nodeTornado: cc.Node,
            //animationBigTimer: cc.Animation,

            nodeBGTimer: cc.Node,
            lbSessionID: cc.Label,
            lbBigTimer: cc.Label, //thoi gian to chinh giua
            lbTimer: cc.Label, //thoi gian nho khi dang o man ket qua,
            lbTotalBetTai: cc.Label, //tong tien bet Tai
            lbTotalBetXiu: cc.Label, //tong tien bet Xiu
            lbUserBetTai: cc.Label, //so user bet Tai
            lbUserBetXiu: cc.Label, //so user bet Xiu
            lblTextNotiNewGame: cc.Label,
            nodeMain: cc.Node,
			Jackpot: cc.Label,
			newSessionSound: cc.AudioSource,
			//nodeNewSesion: cc.Node,
			//nodeCanCua: cc.Node,
        },

        onLoad: function () {
            cc.TaiXiuController.getInstance().setTaiXiuInfoView(this);
            this.Jackpot.string = 0;
            this.reset();
            this.loadSoicau();
        },

        onEnable: function () {
			this.Jackpot.string = 0;
            if (cc.sys.isNative && this.nodeMain !== null && this.nodeMain !== undefined) {
                this.nodeMain.scaleX = 1;
                this.nodeMain.scaleY = 1;
            }
        },
        loadSoicau: function () {
            var delay = 1;
            cc.director.getScheduler().schedule(function () {
                let session_id = this.lbSessionID.string;
                let session_idint = session_id.replace("#", "");
                var arrsoicau = taiXiuConfig.SoiCau;
                if(arrsoicau.length > 0){
                    let sesnow = parseInt(session_idint) - 1;
                    if(sesnow != arrsoicau[0].SessionId){
                        var txGetSoiCauCommand = new cc.TXGetSoiCauCommand;
                        txGetSoiCauCommand.execute(this);
                    }
                }else{
                    var txGetSoiCauCommand = new cc.TXGetSoiCauCommand;
                    txGetSoiCauCommand.execute(this);
                }

            }, this, 1, 0, delay, false);
           
        },
         

        onTXGetSoiCauResponse: function (list) {
            taiXiuConfig.SoiCau = list;
        },
        
        onDestroy: function () {
            cc.TaiXiuController.getInstance().setTaiXiuInfoView(null);
        },

        reset: function () {
            this.isShowTornado1 = false;
            this.isShowTornado2 = false;
            this.isShowTornado3 = false;
            this.currentState = 999;
            this.lastTime = 999;
        },

        updateInfo: function (sessionInfo) {
          
            //check state de xu ly hien thi
            switch (sessionInfo.CurrentState) {
                //giai doan dat cuoc
                case cc.TaiXiuState.BETTING: //54
                    if (this.currentState !== sessionInfo.CurrentState) {
                        //goi reset thong tin betInfo
                        cc.TaiXiuController.getInstance().resetBetAndResultInfo();
                    }
                    if (sessionInfo.Ellapsed == 48) {
                        cc.PopupController.getInstance().showMessageError("Bắt đầu phiên mới");
                        if (this.newSessionSound) this.newSessionSound.play();
                        cc.TaiXiuController.getInstance().disbledotlight();
                    }
                    this.lbBigTimer.node.active = true;
                    this.lbTimer.node.active = false;
                    this.nodeBGTimer.active = false;
					helper.numberToEfect(this.lbTotalBetTai, sessionInfo.TotalBetTai);
					helper.numberToEfect(this.lbTotalBetXiu, sessionInfo.TotalBetXiu);

                    break;
                //giai doan cho ket qua (ko cho dat cuoc)
                case cc.TaiXiuState.END_BETTING:
			     	cc.PopupController.getInstance().showMessageError("Trả tiền cân cửa.");
				
					let TotalTai = sessionInfo.TotalBetTai;
					let TotalXiu = sessionInfo.TotalBetXiu;
                    this.lbBigTimer.node.active = true;
					
                    this.lbTimer.node.active = false;
                    this.nodeBGTimer.active = false;	
					//return;					
					if (TotalTai > TotalXiu){
						let lechtai = TotalTai - TotalXiu;
						let Cancua = TotalTai - lechtai;
						this.lbTotalBetTai.string = cc.Tool.getInstance().formatNumber(Cancua);
						this.lbTotalBetXiu.string = cc.Tool.getInstance().formatNumber(Cancua);
					}else{
						let lechxiu = TotalXiu - TotalTai;
						let Cancua = TotalXiu - lechxiu;
						this.lbTotalBetTai.string = cc.Tool.getInstance().formatNumber(Cancua);
						this.lbTotalBetXiu.string = cc.Tool.getInstance().formatNumber(Cancua);
					}
                    break;

                //giai doan ket qua
                case cc.TaiXiuState.RESULT: //15
                    //dem thoi gian o local
					this.Jackpot.string = cc.Tool.getInstance().formatNumber(sessionInfo.Jackpot);
                    this.lbBigTimer.node.active = false;
                    this.lbTimer.node.active = true;
                    this.nodeBGTimer.active = true;

                    var TotalTaire = sessionInfo.TotalBetTai;
                    var TotalXiure = sessionInfo.TotalBetXiu;
                    if (TotalTaire > TotalXiure){
                        var lechtai = TotalTaire - TotalXiure;
                        var Cancua = TotalTaire - lechtai;
                        this.lbTotalBetTai.string = cc.Tool.getInstance().formatNumber(Cancua);
                        this.lbTotalBetXiu.string = cc.Tool.getInstance().formatNumber(Cancua);
                    }else{
                        var lechxiu = TotalXiure - TotalTaire;
                        var Cancua = TotalXiure - lechxiu;
                        this.lbTotalBetTai.string = cc.Tool.getInstance().formatNumber(Cancua);
                        this.lbTotalBetXiu.string = cc.Tool.getInstance().formatNumber(Cancua);
                    }

                    if(sessionInfo.Ellapsed == 5){
                        let arrsoicau = taiXiuConfig.SoiCau;
                        //console.log("dsfgfdsffdsfdsfdsfdsfdsf");
                        let dicesum = sessionInfo.Result.Dice1 + sessionInfo.Result.Dice2 + sessionInfo.Result.Dice3;
                        let bets = 0;
                        if(dicesum < 11){
                            bets = 1;
                        }
                        let arrayadd = [];
                        arrayadd.SessionId = sessionInfo.SessionID;
                        arrayadd.FirstDice = sessionInfo.Result.Dice1;
                        arrayadd.SecondDice = sessionInfo.Result.Dice2;
                        arrayadd.ThirdDice = sessionInfo.Result.Dice3;
                        arrayadd.DiceSum = dicesum;
                        arrayadd.BetSide = bets;
                        arrayadd.CreatedDate = "";
                       
                        arrsoicau.unshift(arrayadd);
                        arrsoicau.splice(100, 1);
                        taiXiuConfig.SoiCau = arrsoicau;
                    }
                    break;

                //giai doan cho phien moi
                case cc.TaiXiuState.PREPARE_NEW_SESSION:
                    //kiem tra neu chua start timer -> start
                    cc.TaiXiuController.getInstance().resetBetInfo();
                    this.lbBigTimer.node.active = false;
                    this.lbTimer.node.active = true;
                    this.nodeBGTimer.active = true;
					//Tween.numberTo(this.lbJp, this.jackpot0, 1);
                    break;

            }


            //luu lai state hien tai
            this.currentState = sessionInfo.CurrentState;

            //set thong tin
            this.lbSessionID.string = '#' + sessionInfo.SessionID;
            this.lbUserBetTai.string = cc.Tool.getInstance().formatNumber(sessionInfo.TotalTai);
            this.lbUserBetXiu.string = cc.Tool.getInstance().formatNumber(sessionInfo.TotalXiu);
            if(this.Jackpot.string == "0"){
                this.Jackpot.string = cc.Tool.getInstance().formatNumber(sessionInfo.Jackpot);
            }
        },

        updateTimerInfo: function (time) {
			
						
            //console.log('updateTimer: ' +time);
            switch (this.currentState) {
                case cc.TaiXiuState.BETTING: //54
    				if (time === 48){    				    
    			    }
				
                    if(time < 10){
                        this.lbBigTimer.string = '0'+time;
                    }else{
                        this.lbBigTimer.string = time;
                    }
                    
                    if(time < 10){
                        this.lbTimer.string = '0'+time;
                    }else{
                        this.lbTimer.string = time;
                    }

                    break;
                case cc.TaiXiuState.END_BETTING: //15
                    //chua play -> play
                
                    if(time < 10){
                        this.lbBigTimer.string = '0'+time;
                    }else{
                        this.lbBigTimer.string = time;
                    }
                    if (time === 1 || time <= 2){
						this.lbTimer.string = 15;
                    }else{
    					if(time < 10){
                            this.lbTimer.string = '0'+time;
                        }else{
                            this.lbTimer.string = time;
                        }
                    }

                    break;
                case cc.TaiXiuState.RESULT: //15
					if(time < 10){
                        this.lbTimer.string = '0'+time;
                    }else{
                        this.lbTimer.string = time;
                    }
                    //let scale = cc.tween().to(1, { scale: 2 });
                    //cc.tween(this.lbTimer).then(scale);
                    cc.tween(this.lbTimer.node).to(0.1, { scale: 1.5 }).to(0.1, { scale: 1 }).start();

                    this.lbBigTimer.node.color = cc.Color.WHITE;
                     if(time < 10){
                        this.lbBigTimer.string = '0'+time;
                    }else{
                        this.lbBigTimer.string = time;
                    }
                    this.elapsedTime = 0;
                    if (time === 10 || time === 5) {
                        cc.LobbyController.getInstance().refreshAccountInfo();
                    }

                    break;

                case cc.TaiXiuState.PREPARE_NEW_SESSION:
					if(time < 10){
                        this.lbTimer.string = '0'+time;
                    }else{
                        this.lbTimer.string = time;
                    }
                    this.lbBigTimer.node.color = cc.Color.WHITE;
                    if (time === 1){
						
                        this.lbBigTimer.string = 50;
					}else{
						
					   if(time < 10){
                            this.lbBigTimer.string = '0'+time;
                        }else{
                            this.lbBigTimer.string = time;
                        }
					} 

                    break;
            }
            this.lastTime = time;
        }
    });
}).call(this);