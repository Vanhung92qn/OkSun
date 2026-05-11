/**
 * Created by Nofear on 3/22/2019.
 */

var slotsConfig = require('SlotsConfig');
var gameMessage = require('GameMessage');

(function () {
    cc.SpinView = cc.Class({
        extends: cc.SpinViewBase,
        properties: {
            spinColumnViews: [cc.SpinColumnView],
            nodeSpriteTry: cc.Node,
            bgMain1: cc.SpriteFrame,
            bgInside1: cc.SpriteFrame,
            bgMain2: cc.SpriteFrame,
            bgInside2: cc.SpriteFrame,
            bgMain3: cc.SpriteFrame,
            bgInside3: cc.SpriteFrame,
            bgMainSprite: cc.Sprite,
            bgInsideSprite: cc.Sprite,
            nodeAnim1: cc.Node,
            nodeAnim2: cc.Node,
            nodeAnim3: cc.Node,
            skeletonSpin: sp.Skeleton,
            lbBetVal: cc.Label,
            bgVien: cc.Sprite,
            spriteFrameVienFreeSpin: cc.SpriteFrame,
            spriteFrameVien: cc.SpriteFrame,
            skeletonSungBanPhao: sp.Skeleton,
        },

        updateBetUI: function (betVal) {
            //this.lbBetVal.string = 'ĐẶT: ' + cc.Tool.getInstance().formatNumber(betVal);
            this.lbBetVal.string = cc.Tool.getInstance().formatNumberK(betVal);
        },

        updateBGRoomUI: function () {
            // if (this.spriteBGRoom) {
            //     //Lay roomIndex
            //     this.roomIndex = cc.RoomController.getInstance().getRoomId() - 1;
            //     var sfRooms = cc.SpinController.getInstance().getIconView().bgRooms;

            //     this.spriteBGRoom.spriteFrame = sfRooms[Math.min(this.roomIndex, 2)];
            // }

            // cc.log('totalBet ===> ' + this.roomController.roomId);
            // cc.log(this);
            if (this.roomController.roomId == 3) {
                this.nodeSpriteTry.active = true;
                this.bgMainSprite.spriteFrame = this.bgMain1;
                this.bgInsideSprite.spriteFrame = this.bgInside1;
                this.bgVien.spriteFrame = this.spriteFrameVien;
                this.nodeAnim1.active = false;
                this.nodeAnim2.active = false;
                this.nodeAnim3.active = false;
            } else {
                this.nodeSpriteTry.active = false;
                this.bgVien.spriteFrame = this.spriteFrameVien;
                if (this.roomController.roomId == 4) {
                    this.bgMainSprite.spriteFrame = this.bgMain1;
                    this.bgInsideSprite.spriteFrame = this.bgInside1;
                    this.nodeAnim1.active = false;
                    this.nodeAnim2.active = false;
                    this.nodeAnim3.active = false;
                    // nho nhat la 3, 2 la 2
                }
                if (this.roomController.roomId == 2) {
                    this.bgMainSprite.spriteFrame = this.bgMain2;
                    this.bgInsideSprite.spriteFrame = this.bgInside2;
                    this.nodeAnim1.active = false;
                    this.nodeAnim2.active = false;
                    this.nodeAnim3.active = false;
                    // nho nhat la 3, 2 la 2
                }
                if (this.roomController.roomId == 1) {
                    this.bgMainSprite.spriteFrame = this.bgMain3;
                    this.bgInsideSprite.spriteFrame = this.bgInside3;
                    this.nodeAnim1.active = false;
                    this.nodeAnim2.active = false;
                    this.nodeAnim3.active = false;
                    // nho nhat la 3, 2 la 2
                }
            }
        },


        //khi click SPIN goi ham nay
        callSpin: function () {
            if (this.betLinesText === '') {
                cc.PopupController.getInstance().showSlotsMessage(gameMessage.YOU_NOT_CHOOSE_BET_LINES);
                return;
            }

            //kiem tra so du
            if (!this.checkBalance()) return;

            this.setStaeSpin('stop',false);

            cc.AudioController.getInstance().playSound(cc.AudioTypes.SPIN);

            //danh danh trang thai dang SPIN
            this.isSpining = true;
            var self = this;
            this.indexSpin = 0;

            //Set time goi STOP va time goi SPIN cot theo mode
            if (this.isFastSpin) {
                this.timeBetweenCol = slotsConfig.TIME_COLUMN_FAST;
                this.timeStop = slotsConfig.TIME_CALL_STOP_FAST;
            } else {
                this.timeBetweenCol = slotsConfig.TIME_COLUMN_NORMAL;
                this.timeStop = slotsConfig.TIME_CALL_STOP_NORMAL;
            }

            //Stop tat ca cac Effect
            this.resetSpin();

            //Khoa Click cac button chuc nang
            this.spinController.activeButtonSpin(false);

            //Request len server de lay ket qua
            if (this.spinAccountID < 0) {
                this.roomController.sendRequestOnHub(cc.MethodHubName.SPIN_TRY);
            } else {
                if (cc.FreeSpinController.getInstance().getStateFreeSpin()) {
                    this.roomController.sendRequestOnHub(cc.MethodHubName.FREE_SPIN);
                } else {
                    this.roomController.sendRequestOnHub(cc.MethodHubName.SPIN, this.betLinesText);
                }
            }

            //this.startSpin();
        },

        //goi khi STOP SPIN xong
        stopSpinFinish: function () {
            this.indexStopFinish++;
            this.setStaeSpin('spin',true);
            //Khi ca 5 cot deu dung thi cho SPIN tiep
            if (this.indexStopFinish === 5) {
                //doi lai trang thai
                this.isSpining = false;

                /*
                //Bat lai Click cac button chuc nang
                this.spinController.activeButtonSpin(true);*/

                //Lay ve ket qua de hien giai thuong + hieu ung + xu ly neu co bonus game hoac minigame
                this.spinResponse = cc.SpinController.getInstance().getSpinResponse();
                // cc.log(' data ===> ' + JSON.stringify(this.spinResponse));
                // this.spinResponse = {"BetValue":100,"RoomID":1,"TotalLine":30,"IsPlayTry":false,"GameStatus":1,"SpinData":{"SpinID":1520135,"LinesData":"1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30","TotalBet":3000,"SlotsData":[4,1,5,5,2,4,7,2,5,7,7,2,6,7,4],"PrizeLines":[{"LineID":19,"PrizeID":133,"PrizeValue":0,"Items":[12,8,5]},{"LineID":28,"PrizeID":133,"PrizeValue":0,"Items":[12,8,5]}],"TotalFreeSpin":2,"EventFreeSpin":0,"FreeSpinsPrize":0,"IsJackpot":false,"Jackpot":667998,"PaylinePrize":0,"TotalPrize":0,"Balance":9505300,"Response":1},"BonusGame":{"SpinID":1520135,"Multiplier":0,"TotalStep":0,"CurrentStep":0,"Position":"","BonusData":null,"PrizeValue":0},"Account":{"AccountID":200086388,"UserName":"12dsgs311","TotalStar":9505300},"AccountID":200086388,"PlayerStatus":1,"ConnectionStatus":1};
                this.bonusGameData = this.spinResponse.BonusGame;
                var account = this.spinResponse.Account;


                if (cc.FreeSpinController.getInstance().getStateFreeSpin()) {
                    this.spinData = this.spinResponse.FreeSpinData;
                } else {
                    this.spinData = this.spinResponse.SpinData;
                    //Bat lai Click cac button chuc nang
                    if (this.bonusGameData.BonusData === null) {
                        //ko co bonus game. Ko co freespin thi bat lai cac button
                        this.spinController.activeButtonSpin(true);
                    }
                }

                //Update lai balance sau khi SPIN
                if (this.spinResponse.AccountID < 0) {
                    cc.BalanceController.getInstance().updateTryBalance(account.TotalStar);

                } else {
                    cc.BalanceController.getInstance().updateBalance(account.TotalStar);
                }

                var haveWILD = false;
                //Check xem cos WILD ko thi hien Expand WILD truoc
                this.spinColumnViews.forEach(function (spinColumnView) {
                    if (spinColumnView.checkActiveWild()) {
                        haveWILD = true;
                    }
                });

                //co WILD thi cho xong hieu ung WILD moi hien hieu ung thang
                if (haveWILD) {
                    //this.spinController.activeButtonSpin(true);
                    if (cc.FreeSpinController.getInstance().getStateFreeSpin()) {
                        var timePlayEffectWild = slotsConfig.TIME_PLAY_EFFECT_EXPAND_WILD_FREE_SPIN;
                    } else {
                        if (this.isFastSpin) {
                            timePlayEffectWild = slotsConfig.TIME_PLAY_EFFECT_EXPAND_WILD_FAST;
                        } else {
                            timePlayEffectWild = slotsConfig.TIME_PLAY_EFFECT_EXPAND_WILD;
                        }
                        cc.AudioController.getInstance().playSound(cc.AudioTypes.EXPAND_WILD);
                    }
                    var self = this;
                    this.scheduler.schedule(function () {
                        self.playEffect(self.spinData);
                    }, this, 0, 0, timePlayEffectWild, false);
                } else {
                    this.playEffect(this.spinData);
                }


            }
        },


        playEffect: function (spinData) {
            var self = this;

            var timeWaitJackpot = 0;
            //kiem tra co trung jackpot ko?
            if (spinData.IsJackpot) {
                cc.EffectController.getInstance().playEffect(cc.EffectType.JACKPOT, spinData.PaylinePrize);
                cc.PayLinesController.getInstance().playEffect(spinData.PrizeLines, -1); //jackpot delay = -1
                cc.AudioController.getInstance().playSound(cc.AudioTypes.BIG_WIN);

                //stop autoSpin
                this.isAutoSpin = false;
                this.spinController.activeButtonAutoSpin(this.isAutoSpin);
                timeWaitJackpot = 2;
            }

            //neu co jackpot thi hien Jackpot 2s sau do moi check tiep
            this.scheduler.schedule(function () {
                self.checkHaveBonusGame();

                //dang ko phai la freeSpin thi moi check
                if (cc.FreeSpinController.getInstance().getStateFreeSpin() === false && spinData.TotalFreeSpin > 0) {
                    //tat auto SPIN
                    this.isAutoSpin = false;
                    this.spinController.activeButtonAutoSpin(this.isAutoSpin);

                    this.lbiTotalWin.tweenValueto(this.spinData.PaylinePrize);

                    cc.EffectController.getInstance().playEffect(cc.EffectType.FREE_SPIN, spinData.PaylinePrize, self.isFastSpin ? slotsConfig.TIME_TWEEN_MONEY_FAST : null); // animatio freespin
                    //duoc freespin -> kich hoạt freespin sau xx giay
                    // cc.PopupController.getInstance().showSlotsMessage(
                    //     gameMessage.GET_FREE_SPIN
                    //     + spinData.FreeCoefficient
                    // );
                    this.scheduler.schedule(function () {
                        cc.EffectController.getInstance().stopEffect();
                        cc.FreeSpinController.getInstance().activeFreeSpin(true);
                        cc.FreeSpinController.getInstance().updateFreeSpinText(spinData.TotalFreeSpin);
                        //reset totalWin UI ve 0
                        self.lbiTotalWin.setValue(0);
                    }, this, 0, 0, slotsConfig.TIME_WAIT_START_FREE_SPIN, false);

                    return;
                } else if (cc.FreeSpinController.getInstance().getStateFreeSpin()) {
                    cc.FreeSpinController.getInstance().updateFreeSpinText(spinData.TotalFreeSpin);
                }

                if (cc.FreeSpinController.getInstance().getStateFreeSpin()) {
                    //update Win UI = totalPrize
                    this.lbiTotalWin.tweenValueto(this.spinData.TotalPrize);
                } else {
                    //choi normal = PaylinePrize
                    this.lbiTotalWin.tweenValueto(this.spinData.PaylinePrize);
                }


                //Van con freespin thi bat lai nut quay luon (truong hop = 0 phai cho het anim)
                if (cc.FreeSpinController.getInstance().getStateFreeSpin() && spinData.TotalFreeSpin > 0) {
                    //Bat lai Click cac button chuc nang
                    this.spinController.activeButtonSpin(true);
                } else if (!cc.FreeSpinController.getInstance().getStateFreeSpin()) {
                    //Bat lai Click cac button chuc nang
                    this.spinController.activeButtonSpin(true);
                }

                if (spinData.PaylinePrize > 0) { //PaylinePrize //TotalPrize
                    this.setStaeSungBanPhao("win",false);
                    if (!spinData.IsJackpot) {
                        if (spinData.PaylinePrize >= this.spinResponse.BetValue * cc.Config.getInstance().getMultiplierByRoomId(this.spinResponse.RoomID)) {
                            cc.EffectController.getInstance().playEffect(cc.EffectType.BIG_WIN, spinData.PaylinePrize, self.isFastSpin ? slotsConfig.TIME_TWEEN_MONEY_FAST : null); //PaylinePrize
                            cc.PayLinesController.getInstance().playEffect(spinData.PrizeLines, self.isFastSpin ? slotsConfig.TIME_MONEY_EFFECT_BIG_WIN_FAST : slotsConfig.TIME_MONEY_EFFECT_BIG_WIN);
                            cc.AudioController.getInstance().playSound(cc.AudioTypes.BIG_WIN);
                            this.scheduler.schedule(function () {
                                self.checkHaveFreeSpin(spinData);
                            }, this, 0, 0, self.isFastSpin ? slotsConfig.TIME_MONEY_EFFECT_BIG_WIN_FAST : slotsConfig.TIME_MONEY_EFFECT_BIG_WIN, false);
                        } else {
                            cc.EffectController.getInstance().playEffect(cc.EffectType.NORMAL_WIN, spinData.PaylinePrize, self.isFastSpin ? slotsConfig.TIME_TWEEN_MONEY_FAST : null); //PaylinePrize
                            cc.PayLinesController.getInstance().playEffect(spinData.PrizeLines, self.isFastSpin ? slotsConfig.TIME_MONEY_EFFECT_NORMAL_WIN_FAST : slotsConfig.TIME_MONEY_EFFECT_NORMAL_WIN);
                            cc.AudioController.getInstance().playSound(cc.AudioTypes.NORMAL_WIN);
                            this.scheduler.schedule(function () {
                                self.checkHaveFreeSpin(spinData);
                            }, this, 0, 0, self.isFastSpin ? slotsConfig.TIME_MONEY_EFFECT_NORMAL_WIN_FAST : slotsConfig.TIME_MONEY_EFFECT_NORMAL_WIN, false);
                        }
                    }

                    //set gia tri base phuc vu cho viec choi X2
                    cc.X2GameController.getInstance().setBaseValue(this.spinResponse.SpinData.DoubleSet);
                    //da khi quay xong -> chua co data
                    cc.X2GameController.getInstance().setX2GameData(this.spinResponse.X2Game);

                    //Tk that moi choi duoc x2
                    if (this.spinResponse.AccountID > 0 && this.spinResponse.SpinData.DoubleSet > 0) {
                        //Neu thang thi bat button X2 len
                        cc.SpinController.getInstance().activeButtonX2(true);
                    } else {
                        cc.SpinController.getInstance().activeButtonX2(false);
                    }
                } else {
                    //THua -> ko lam gi
                    this.scheduler.schedule(function () {
                        self.checkHaveFreeSpin(spinData);
                    }, this, 0, 0, self.isFastSpin ? slotsConfig.TIME_WAIT_LOST_FAST : slotsConfig.TIME_WAIT_LOST, false);
                }

            }, this, 0, 0, timeWaitJackpot, false);

        },

        x2Clicked: function () {
            cc.SpinController.getInstance().activeButtonX2(false);
            cc.MainController.getInstance().createX2GameView();
        },

        setStaeSpin: function(state,loop){
            this.skeletonSpin.setAnimation(0, state, loop);
        },

        setStaeSungBanPhao: function(state,loop){
            this.skeletonSungBanPhao.setAnimation(0, state, loop);
                        this.skeletonSungBanPhao.setCompleteListener(
                            function () {
                                this.skeletonSungBanPhao.setAnimation(0, 'loop', true);
                            }.bind(this)
                        );
        },

        stopAutoSpinClicked: function () {
            this.isAutoSpin = false;
        },
    });
}.call(this));
