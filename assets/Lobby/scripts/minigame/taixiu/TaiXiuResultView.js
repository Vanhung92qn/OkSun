/**
 * Ket qua, effect ket qua,
 */


var taiXiuConfig = require('TaiXiuConfig');

(function () {
    cc.TaiXiuResultView = cc.Class({
        "extends": cc.Component,
        properties: {
            //node ket qua
            nodeResult: cc.Node,
            //node 3 dice ket qua
            nodeResultDice: cc.Node,

            //bat de nan
            nodeBowl: cc.Node,

            //animation Dice
            nodeBGTimer: cc.Node,
            //animationDice: cc.Animation,
            xnAnimation: {
                default: [],
                type: sp.Skeleton,
            },
            xnAnimationplay: cc.Node,
            xnEffect: sp.Skeleton,
            //sprite 3 dice

            //label tong diem cua 3 dice
            nodeBgTotalDice: cc.Node,
            lbTotalDice: cc.Label,
            //amthanhmodia: cc.AudioSource,

            //node effect bat len khi win
            nodeTaiWins: [cc.Node],
            nodeXiuWins: [cc.Node],
            winSound: cc.AudioSource,
            //node Tai/Xiu tat di khi chay fx
            nodeTai: cc.Node,
            nodeXiu: cc.Node,
            rollDice: cc.AudioSource,
            Jackpot: cc.Node,
            //spriteFrame 6 dice
            bglwincash: cc.Node,
            lblwincash: cc.Label,
            nodeAinXoc: cc.Node,

            xuc1: cc.Sprite,
            xuc2: cc.Sprite,
            xuc3: cc.Sprite,
            sfXuc: [cc.SpriteFrame]

        },

        onLoad: function () {
            //setView
            cc.TaiXiuController.getInstance().setTaiXiuResultView(this);
            this.rootPasBowl = this.nodeBowl.position; //save lai vi tri goc
            this.timeouts = [];


            this.reset();
        },

        onDestroy: function () {
            cc.TaiXiuController.getInstance().setTaiXiuResultView(null);
            this.timeouts.forEach(t => {
                clearTimeout(t);
            });
            this.timeouts = [];
        },

        reset: function () {
            this.currentState = 999;
            this.resetUI();
        },

        resetUI: function () {
            //dang play anim dice?
            this.animationOpenPlaying = false;
            // this.animationDice.stop();
            // this.animationDice.node.active = false;
            this.nodeResult.active = false;
            this.Jackpot.active = false;
            this.nodeBGTimer.active = false;
            // this.nodeDiceAnim.active = false;
            this.xnAnimationplay.active = false;
            this.lbTotalDice.node.active = false;

            //reset lai vi tri bowl
            this.nodeBowl.position = this.rootPasBowl;

            this.nodeTaiWins.forEach(function (nodeTaiWin) {
                nodeTaiWin.active = false;
            });
            this.nodeXiuWins.forEach(function (nodeXiuWin) {
                nodeXiuWin.active = false;
            });

            this.nodeTai.active = true;
            this.nodeXiu.active = true;
        },

        getIsBowl: function () {
            return this.nodeBowl.active;
        },

        updateResult: function (sessionInfo) {
            if (sessionInfo.CurrentState !== this.currentState) {
                //check state de xu ly hien thi
                switch (sessionInfo.CurrentState) {
                    case cc.TaiXiuState.BETTING: //54
                        //reset lai UI
                        this.resetUI();
                        break;
                    case cc.TaiXiuState.END_BETTING:
                        //Ko cho dat cuoc nua
                        //reset lai UI
                        this.resetUI();
                        break;
                    case cc.TaiXiuState.RESULT: //15
                        this.playAnimationAndSetResult(sessionInfo);

                        break;
                    case cc.TaiXiuState.PREPARE_NEW_SESSION:
                        //neu dang hien thi bat de nan -> tat bat di + play fx
                        if (this.nodeBowl.active) {
                            //this.amthanhmodia.play();
                            this.nodeBowl.active = false;
                            this.startEffectResult();
                            //hien effect
                        } else {
                            this.setResult(sessionInfo);
                        }
                        break;

                }
            }

            this.currentState = sessionInfo.CurrentState;
        },



        playAnimationAndSetResult: function (sessionInfo) {
            //tinh total Dice
            this.totalDice = sessionInfo.Result.Dice1 + sessionInfo.Result.Dice2 + sessionInfo.Result.Dice3;
            this.TotalXiuIsJackpot = sessionInfo.TotalXiuIsJackpot;
            //tat node Result
            this.nodeResult.active = false;

            this.xnAnimationplay.active = true;

            //set thong so diem cua Dice
            // this.lbTotalDice.string  = this.totalDice;

            //set ket qua vao sprite Dice
            if (cc.TaiXiuController.getInstance().getIsNan()) {
                this.timeouts.push(setTimeout(function () {
                    this.nodeBowl.active = true;
                }.bind(this), 2100));
            }
            this.nodeAinXoc.active = true;
            this.animation = this.nodeAinXoc.getComponent(cc.Animation);
            this.animation.play('xocxocdice');
            this.data = sessionInfo;
            this.animation.on('finished', this.setResultDiceFrame, this);

            // this.xnAnimation[0].setAnimation(0, `#1 WHITE_F${sessionInfo.Result.Dice1}`, false);
            // this.xnAnimation[1].setAnimation(0, `#2 WHITE_F${sessionInfo.Result.Dice2}`, false);
            // this.xnAnimation[2].setAnimation(0, `#3 WHITE_F${sessionInfo.Result.Dice3}`, false);
            this.rollDice.play();
            //this.amthanhxucxac.play();

            // this.xnAnimation[0].setCompleteListener(function () {
            //     this.nodeBGTimer.active = true;
            //     this.diceAnimFinish();
            //     this.updateLastSession(sessionInfo);
            // }.bind(this))


            //anim mới
            // this.nodeDiceAnim.active = true;               
            // this.animXocBat.__preload();

            //Bat node Dice Anim
            // this.animationDice.node.active = true;
            // this.animationDice.play('diceAnimNew'); //diceAnimationOld

            //danh dau la dang play
            this.animationOpenPlaying = true;
        },

        updateLastSession: function (sessionInfo) {
            let dataResult = {};
            dataResult.SessionId = sessionInfo.SessionID;
            dataResult.FirstDice = sessionInfo.Result.Dice1;
            dataResult.SecondDice = sessionInfo.Result.Dice2;
            dataResult.ThirdDice = sessionInfo.Result.Dice3;
            dataResult.DiceSum = sessionInfo.Result.Dice1 + sessionInfo.Result.Dice2 + sessionInfo.Result.Dice3;
            dataResult.BetSide = 0;
            dataResult.CreatedDate = "2023-08-18T12:14:42.627";
            let temp = [];
            temp.push(dataResult);
            let historyTemp = [].concat(temp, cc.TaiXiuController.getInstance().taiXiuSessionHistoryView.gameHistory);
       //     cc.TaiXiuController.getInstance().taiXiuSessionHistoryView.updateSessionHistory(historyTemp);
      //      cc.TaiXiuController.getInstance().taiXiuSessionHistoryView.enabledotlight();
        },

        //chi bat ket qua xuc xac (che do Nan)
        setResultDice: function (sessionInfo) {
            //bat node Result

            this.nodeResult.active = true;

            // this.xnAnimation[0].setAnimation(0, `#1 WHITE_F${sessionInfo.Result.Dice1}`, false);
            // this.xnAnimation[1].setAnimation(0, `#2 WHITE_F${sessionInfo.Result.Dice2}`, false);
            // this.xnAnimation[2].setAnimation(0, `#3 WHITE_F${sessionInfo.Result.Dice3}`, false);

            this.xuc1.spriteFrame = this.sfXuc[sessionInfo.Result.Dice1 - 1];
            this.xuc2.spriteFrame = this.sfXuc[sessionInfo.Result.Dice2 - 1];
            this.xuc3.spriteFrame = this.sfXuc[sessionInfo.Result.Dice3 - 1];

            setTimeout(function(){
                this.nodeBGTimer.active = true;
            }.bind(this), 100);

            //this.amthanhxucxac.play();
            //this.xnEffect.node.active = true
            //this.xnEffect.setAnimation(0,'effect',false)
            this.diceAnimFinish();
            // this.xnAnimation[0].setCompleteListener(function () {
            //     this.nodeBGTimer.active = true;
            // }.bind(this), 100)

            // this.xuc1.spriteFrame = this.sfXuc[sessionInfo.Result.Dice1-1];
            // this.xuc2.spriteFrame = this.sfXuc[sessionInfo.Result.Dice2-1];
            // this.xuc3.spriteFrame = this.sfXuc[sessionInfo.Result.Dice3-1];
        },

        setResultDiceFrame: function () {
            this.nodeAinXoc.active = false;
            this.nodeResult.active = true;
            this.xuc1.spriteFrame = this.sfXuc[this.data.Result.Dice1 - 1];
            this.xuc2.spriteFrame = this.sfXuc[this.data.Result.Dice2 - 1];
            this.xuc3.spriteFrame = this.sfXuc[this.data.Result.Dice3 - 1];
            this.nodeBGTimer.active = true;
            this.diceAnimFinish();
            this.updateLastSession(this.data);
        },

        //goi set ket qua luon (ko chay animation dice)
        setResult: function (sessionInfo) {
            //neu dang play animation dice thi return luon. Ket qua se tu hien sau khi anim ket thuc
            if (this.animationOpenPlaying) return;
            this.TotalXiuIsJackpot = sessionInfo.TotalXiuIsJackpot;
            //hien luon ket qua
            this.totalDice = sessionInfo.Result.Dice1 + sessionInfo.Result.Dice2 + sessionInfo.Result.Dice3;

            //bat node Result
            this.nodeResult.active = true;

            //set thong so diem cua Dice
            // this.lbTotalDice.string  = this.totalDice;

            //set ket qua vao sprite Dice
            // this.xnAnimation[0].setAnimation(0, `#1 WHITE_F${sessionInfo.Result.Dice1}`, false);
            // this.xnAnimation[1].setAnimation(0, `#2 WHITE_F${sessionInfo.Result.Dice2}`, false);
            // this.xnAnimation[2].setAnimation(0, `#3 WHITE_F${sessionInfo.Result.Dice3}`, false);

            this.xuc1.spriteFrame = this.sfXuc[sessionInfo.Result.Dice1 - 1];
            this.xuc2.spriteFrame = this.sfXuc[sessionInfo.Result.Dice2 - 1];
            this.xuc3.spriteFrame = this.sfXuc[sessionInfo.Result.Dice3 - 1];


            //this.amthanhxucxac.play();
            //this.xnEffect.node.active = true
            //this.xnEffect.setAnimation(0,'effect',false)
            this.diceAnimFinish();
            setTimeout(function(){
                this.nodeBGTimer.active = true;
            }.bind(this), 100);
            
            // this.xnAnimation[0].setCompleteListener(function () {
            //     this.nodeBGTimer.active = true;
            // }.bind(this), 100)

            // this.spriteDice1.spriteFrame = this.sfDice1s[sessionInfo.Result.Dice1 - 1];
            //this.spriteDice2.spriteFrame = this.sfDice2s[sessionInfo.Result.Dice2 - 1];
            //this.spriteDice3.spriteFrame = this.sfDice3s[sessionInfo.Result.Dice3 - 1];



            //effect
            this.startEffectResult();

        },

        startEffectResult: function () {

            //  if(this.totalDice == 3 || this.totalDice == 18){
            //     if(this.TotalXiuIsJackpot == true){
            //         this.SetJackpot();
            //     }

            // }else if(this.totalDice == 10 || this.totalDice == 15){
            //     // cc.TaiXiuController.getInstance().taiXiuInfoView.showToast("Xuất hiện Tổng ("+this.totalDice+") tiền Win sẽ được x1.5");
            // }
            this.winSound.play();
            //Kiem tra xem ban nao thang
            if (this.totalDice > 10) {
                //TAI
                this.nodeTaiWins.forEach(function (nodeTaiWin) {
                    nodeTaiWin.active = true;
                    cc.tween(nodeTaiWin).repeatForever(cc.tween().sequence(cc.tween().to(0.2, { scale: 1 }, { easing: cc.easing.sineOut }), cc.tween().to(0.2, { scale: 1.1 }, { easing: cc.easing.sineOut }))).start();
                });
                this.nodeXiuWins.forEach(function (nodeXiuWin) {
                    nodeXiuWin.active = false;
                });
                this.nodeTai.active = false;
            } else if (this.totalDice > 2 && this.totalDice <= 10) {
                //XIU
                this.nodeTaiWins.forEach(function (nodeTaiWin) {
                    nodeTaiWin.active = false;
                });
                this.nodeXiuWins.forEach(function (nodeXiuWin) {
                    nodeXiuWin.active = true;
                    cc.tween(nodeXiuWin).repeatForever(cc.tween().sequence(cc.tween().to(0.2, { scale: 1 }, { easing: cc.easing.sineOut }), cc.tween().to(0.2, { scale: 1.1 }, { easing: cc.easing.sineOut }))).start();
                });
                this.nodeXiu.active = false;
            }
        },
        openEndDiaNan: function () {
            if (this.nodeBowl.active) {
                this.nodeBowl.active = false;
                this.startEffectResult();
            }
        },
        SetJackpot: function () {
            this.Jackpot.active = true;
            this.node.runAction(
                cc.sequence(
                    cc.delayTime(6),
                    cc.callFunc(function () {
                        this.Jackpot.active = false;
                    }.bind(this)
                    )
                ));
        },
        //sau khi play xong animation Dice
        diceAnimFinish: function () {
            this.nodeBGTimer.active = true;
            // anim mới xong
            // this.nodeDiceAnim.active = false; 
            //dang mo bat de nan -> ko chay animation thang
            if (cc.TaiXiuController.getInstance().getIsNan()) {
                this.nodeBowl.active = true;
                //tat node Dice Anim
                // this.animationDice.node.active = false;

                this.timeouts.push(setTimeout(() => {
                    this.openEndDiaNan();
                }, 10000));
            } else {
                //tat node Dice Anim
                // this.animationDice.node.active = false;


                //Bat node ket qua tong
                //this.lbTotalDice.node.active = true;

                //effect
                this.startEffectResult();
            }
        },

    });
}).call(this);
