/**
 * Created by Welcome on 5/28/2019.
 */

(function () {
    cc.XXResultView = cc.Class({
        "extends": cc.Component,
        properties: {
            nodeBatNan: cc.Node,
            //  nodeDia: cc.Node,
            animationBat: sp.Skeleton,

            spriteVis: [cc.Sprite],

            sfVis: [cc.SpriteFrame],
            //	startbet: cc.AudioClip,
            //	stoptbet: cc.AudioClip,
            //	rollBowl: cc.AudioClip,

            animResult: cc.Animation,
            nodeChan: cc.Node,
            nodeLe: cc.Node,

            nodeChan1: cc.Node,
            nodeChan2: cc.Node,
            nodeChan3: cc.Node,

            nodeLe1: cc.Node,
            nodeLe2: cc.Node,
            nodeLe3: cc.Node,

            btnNodeChan1: cc.Node,
            btnNodeChan2: cc.Node,
            btnNodeChan3: cc.Node,

            btnNodeLe1: cc.Node,
            btnNodeLe2: cc.Node,
            btnNodeLe3: cc.Node,
            dealer: sp.Skeleton,
            //md5key: cc.Label,
            //md5hash: cc.Label,
            //nodeketqua: cc.Node,
            //jackpot: cc.LabelIncrement,
            //  animationHu: sp.Skeleton,
            dia: cc.Node,
            // close, idle, open, shake
        },

        onLoad: function () {
            cc.XXController.getInstance().setXXResultView(this);
            var self = this;
            this.valueJp = 0;
            this.currentState = -1;
            this.nodeResult = this.animResult.node;
            this.nodeFxResult = this.nodeChan1.parent;

            //node parent Vi
            this.nodeViParent = this.spriteVis[0].node.parent;

            //toa do cua bat Nan
            this.batNanPos = cc.v2(0, 136.811);
            this.timeouts = [];
        },
        onDestroy: function () {
            this.timeouts.forEach(function (t) {
                clearTimeout(t);
            })
            this.timeouts = [];
        },

        reset: function () {
        },

        updateResult: function (players, result, originResult, state, openNow, data) {
            if (!this.nodeBatNan) return;
            //	 this.sound = cc.Tool.getInstance().getItem("@Sound").toString() === 'true';
            //    if (this.valueJp != data.Jackpot) {
            //        this.jackpot.tweenValueto(data.Jackpot);
            //        this.valueJp != data.Jackpot
            //    }
            // cc.log('state ==> ' + state);
            // cc.log('data ==> ' + JSON.stringify(data));
            //check state de xu ly hien thi
            // in ra jackpot
            // if (data.Jackpot) {
            //     console.log("Jackpot: ", data.Jackpot);
            // }
            switch (state) {
                //giai doan dat cuoc
                case cc.XXState.BETTING: //54
                    if (this.currentState !== state) {
                        //this.nodeBatNan.active = false;
                        //  this.nodeDia.active = false;
                        //this.nodeBatNan.position = this.batNanPos;
                        //	this.playAudio(this.startbet);

                        this.animationBat.node.active = true;
                        this.animationBat.clearTracks();
                        this.animationBat.setToSetupPose();
                        // this.dealer.setAnimation(0, "dat_rong", false);
                        // this.animationBat.setAnimation(1, "idle", false);
                        //   this.playAnimationHu(true, 'Idle2');

                        this.dia.active = false;
                        this.nodeResult.active = false;
                        this.nodeViParent.active = false;
                        this.nodeFxResult.active = false;
                        //this.md5key.node.active = true;
                        //this.nodeketqua.active = false;
                        //this.md5keycache = data.Md5Encript;
                        //this.md5key.string = cc.Config.getInstance().formatName(this.md5keycache, this.md5keycache.length - 6);
                        if (data.Elapsed == 0) {
                            this.dealer.setAnimation(0, "dat_rong", false);
                            this.dealer.setCompleteListener(
                                function () {
                                    this.dealer.setAnimation(0, 'idle_rong', true);
                                }.bind(this)
                            );
                        } else {
                            this.dealer.setAnimation(0, "idle_rong", true);
                        }
                    }
                    else {
                        this.dealer.setAnimation(0, "idle_rong", true);
                    }

                    break;
                //giai doan mo bat
                case cc.XXState.OPEN_PLATE:

                    if (this.currentState !== state) {
                        //this.dealer.setAnimation(1, "Smile", false);
                        // this.nodeBatNan.active = false;
                        //  this.nodeDia.active = false;
                        //this.nodeBatNan.position = this.batNanPos;

                        //this.animationBat.node.active = true;
                        //this.animationBat.clearTracks();
                        //this.animationBat.setToSetupPose();
                        // this.animationBat.setAnimation(1, "Idle_2", true);

                        this.nodeResult.active = false;
                        //this.nodeViParent.active = false;
                        this.nodeFxResult.active = false;
                        //this.md5key.node.active = false;                        
                        //this.md5hashcache = data.Md5Decript;
                        // this.md5hash.string = this.md5hashcache;
                        // this.nodeketqua.active = true;

                        //chay animation
                        this.playFxResult(data.Result, originResult, openNow);
                        //    this.playAnimationHu(true, 'Idle2');
                        this.dia.active = true;
                        this.dealer.setAnimation(0, "ketqua_rong", false);
                        this.dealer.setCompleteListener(
                            function () {
                                this.dealer.setAnimation(0, 'idle_rong', true);
                            }.bind(this)
                        );
                    }
                    break;

                //giai doan ket qua
                case cc.XXState.SHOW_RESULT: //15

                    if (this.currentState !== state) {
                        //this.dealer.setAnimation(1, "Smile", false);
                        // if (this.nodeBatNan.active) {
                        // this.nodeBatNan.active = false;
                        //    this.nodeDia.active = true;
                        //   this.playAudio(this.stoptbet);
                        this.nodeViParent.active = true;
                        //this.animationBat.node.active = false;
                        // }
                        // //chay fx pay
                        this.animationBat.setAnimation(0, 'open', false);
                        this.playPayFx(players, result);
                        //       this.playAnimationHu(true, 'Idle2');
                        // this.dia.active = true;
                    }
                    break;

                //giai doan cho phien moi
                case cc.XXState.WAITING:

                    if (this.currentState !== state) {
                        //		this.playAudio(this.rollBowl);
                        // this.dealer.setAnimation(1, "Smile", false);
                        cc.XXController.getInstance().initGateChip();
                        // an bat Nan di
                        // this.nodeBatNan.active = false;
                        //   this.nodeDia.active = false;
                        // this.nodeBatNan.position = this.batNanPos;

                        // this.animationBat.node.active = true;
                        // this.animationBat.clearTracks();
                        // this.animationBat.setToSetupPose();
                        // this.animationBat.setAnimation(1, "Idle_2", true);

                        // An ket qua + fx
                        this.nodeViParent.active = false;
                        // this.nodeResult.active = false;
                        this.nodeFxResult.active = false;
                        //     this.playAnimationHu(true, 'Idle2');

                        // show dia, cho bat up xuong, roi lac
                        this.dia.active = true;
                        this.animationBat.setAnimation(0, "close", false);

                        this.btnNodeChan1.color = new cc.Color(255, 255, 255);
                        this.btnNodeChan2.color = new cc.Color(255, 255, 255);
                        this.btnNodeChan3.color = new cc.Color(255, 255, 255);

                        this.btnNodeLe1.color = new cc.Color(255, 255, 255);
                        this.btnNodeLe2.color = new cc.Color(255, 255, 255);
                        this.btnNodeLe3.color = new cc.Color(255, 255, 255);
                        // var delay = 1;
                        // cc.director.getScheduler().schedule(function () {
                        //     this.animationBat.setAnimation(0, "shake", false);
                        //  }, this, 1, 0, delay, false);
                    }
                    break;
                //xoc dia
                case cc.XXState.SHAKING:
                    //play animation xoc bat
                    if (this.currentState !== state) {
                        //this.dealer.setAnimation(1, "Smile", false);
                        //An ket qua + fx
                        this.nodeResult.active = false;
                        this.nodeViParent.active = false;
                        this.nodeFxResult.active = false;

                        //an bat Nan di
                        this.nodeBatNan.active = false;
                        //    this.nodeDia.active = false;
                        // this.nodeBatNan.position = this.batNanPos;
                        this.dia.active = false;
                        this.animationBat.node.active = true;
                        this.animationBat.clearTracks();
                        this.animationBat.setToSetupPose();
                        // this.animationBat.setAnimation(5, "Xoc Dia", false);
                        this.animationBat.setAnimation(0, "shake", false);
                        this.dia.active = false;

                        this.timeouts.push(setTimeout(function () {
                            cc.XXController.getInstance().setAnimationTimeBet("appear");
                        }, 1000));

                        //this.md5hash.node.active = false;
                        //this.nodeketqua.active = false;
                        //  this.playAnimationHu(true, 'Idle2');
                    }
                    break;
            }

            //luu lai state hien tai
            this.currentState = state;
        },

        playFxResult: function (result, originResult, openNow) {

            var self = this;

            this.nodeFxResult.active = true;
            this.nodeResult.active = true;
            this.nodeViParent.active = true;
            this.animResult.stop();
            // this.nodeChan.active = false;
            // this.nodeLe.active = false;

            this.nodeChan1.active = false;
            this.nodeChan2.active = false;
            this.nodeChan3.active = false;
            this.nodeLe1.active = false;
            this.nodeLe2.active = false;
            this.nodeLe3.active = false;

            // this.btnNodeChan1.color = new cc.Color(182, 172, 172);
            // this.btnNodeChan2.color = new cc.Color(182, 172, 172);
            // this.btnNodeChan3.color = new cc.Color(182, 172, 172);

            // this.btnNodeLe1.color = new cc.Color(182, 172, 172);
            // this.btnNodeLe2.color = new cc.Color(182, 172, 172);
            // this.btnNodeLe3.color = new cc.Color(182, 172, 172);

            var results = result.ChipsData.split(',');
            // cc.log('results ===> ' + results);
            //duyet qua ket qua cua tung Vi
            var index = 0;

            results.forEach(function (result) {
                self.spriteVis[index].spriteFrame = self.sfVis[parseInt(result)];
                index++;
            });

            //dang o che do Nan
            // if (cc.XXController.getInstance().getIsNan() && !openNow) {
            //     //bat bat Nan
            //     this.nodeDia.active = true;
            //     this.nodeBatNan.active = true;
            //     this.nodeBatNan.position = this.batNanPos;
            //     //tat cai bat animation
            //     // this.animationBat.clearTracks();
            //     // this.animationBat.setToSetupPose();
            //     // this.animationBat.setAnimation(0, "IdleDia", false);
            //     this.animationBat.node.active = false;

            //     setTimeout(function () {
            //         self.nodeBatNan.active = false;
            //     }, 5000);

            // } else {
            //     //tat bat Nan
            //     this.nodeBatNan.active = false;
            //     this.nodeDia.active = true;
            //     //play animation mo bat
            //     this.animationBat.node.active = true;
            //     this.animationBat.clearTracks();
            //     this.animationBat.setToSetupPose();
            //     this.animationBat.setAnimation(3, "mo", false);
            // }

            this.animationBat.node.active = true;
            this.animationBat.clearTracks();
            this.animationBat.setToSetupPose();
            if (result.BigGate == 1) {
                if (result.SmallGate == 2) {
                    // this.animationBat.setAnimation(1, "3 vang", false);
                }
                else {
                    // this.animationBat.setAnimation(1, "3 trang", false);
                }
            } else {
                if (result.SmallGate == 0) {
                    // this.animationBat.setAnimation(1, "2 vang", false);
                }
                else if (result.SmallGate == 5) {
                    // this.animationBat.setAnimation(1, "4 vang", false);
                }
                else {
                    // this.animationBat.setAnimation(1, "4 trang", false);
                }
            }
        },
        //    md5view: function () {

        //     },
        //    playAnimationHu: function (loop, aniName) {
        //        this.animationHu.clearTracks();
        //        this.animationHu.setToSetupPose();
        //        this.animationHu.setAnimation(1, aniName, loop);
        //
        //    },
        playPayFx: function (players, result) {
            //lay ve danh sach cac player
            let gateChips = cc.XXController.getInstance().getGateChips();
            if (!gateChips) {
                console.warn('❌ gateChips not ready, skip playPayFx');
                return;
            }
            var self = this;
            let bigGate = parseInt(result.BigGate);
            let smallGate = parseInt(result.SmallGate);
            this.btnNodeChan1.color = new cc.Color(182, 172, 172);
            this.btnNodeChan2.color = new cc.Color(182, 172, 172);
            this.btnNodeChan3.color = new cc.Color(182, 172, 172);

            this.btnNodeLe1.color = new cc.Color(182, 172, 172);
            this.btnNodeLe2.color = new cc.Color(182, 172, 172);
            this.btnNodeLe3.color = new cc.Color(182, 172, 172);
            switch (bigGate) {
                case cc.XXGate.EVEN:
                    self.btnNodeChan1.color = new cc.Color(255, 255, 255);
                    self.animResult.play('chan_blink');
                    break;
                case cc.XXGate.ODD:
                    self.btnNodeLe1.color = new cc.Color(255, 255, 255);
                    self.animResult.play('le_blink');
                    break;
            }
            switch (smallGate) {
                case cc.XXGate.THREE_UP:
                    self.btnNodeLe1.color = new cc.Color(255, 255, 255);
                    self.btnNodeLe2.color = new cc.Color(255, 255, 255);
                    self.nodeLe1.active = true;
                    self.nodeLe2.active = true;
                    break;
                case cc.XXGate.THREE_DOWN:
                    self.btnNodeLe1.color = new cc.Color(255, 255, 255);
                    self.btnNodeLe3.color = new cc.Color(255, 255, 255);
                    self.nodeLe1.active = true;
                    self.nodeLe3.active = true;
                    break;
                case cc.XXGate.FOUR_DOWN:
                    self.btnNodeChan1.color = new cc.Color(255, 255, 255);
                    self.btnNodeChan3.color = new cc.Color(255, 255, 255);
                    self.nodeChan1.active = true;
                    self.nodeChan3.active = true;
                    break;
                case cc.XXGate.FOUR_UP:
                    self.btnNodeChan1.color = new cc.Color(255, 255, 255);
                    self.btnNodeChan2.color = new cc.Color(255, 255, 255);
                    self.nodeChan1.active = true;
                    self.nodeChan2.active = true;
                    break;
                default:
                    self.nodeChan1.active = true;
            }

            //Loc danh sach cua thang
            let arrGateWin = [bigGate, smallGate];

            //Loc danh sach cua thua
            let arrGateLose = [];
            gateChips.map((gate, index) => {
                if (!arrGateWin.includes(index)) {
                    arrGateLose.push(index)
                }
            }, this);

            var totalLost = 0;
            //Hieu ung chip thua bay tu table -> dealer
            this.fxMoveChip(arrGateLose, cc.XX_FX.LOSE);


            var totalWin = 0;
            //Hieu ung chip thang bay tu dealer -> table

            this.timeouts.push(setTimeout(function () {
                this.fxMoveChip(arrGateWin, cc.XX_FX.DEALER_PAY);
            }.bind(this), 3000));


            var total = 0;
            //Hieu ung chip thang bay tu table -> player
            this.timeouts.push(setTimeout(function () {
                this.fxMoveChip(arrGateWin, cc.XX_FX.PAY);
            }.bind(this), 2000))

        },

        //Hieu ung bay chip
        fxMoveChip: function (arrGate, typeFx) {
            try {
                let gateChips = cc.XXController.getInstance().getGateChips();
                arrGate.map(gateIndex => {
                    if (gateChips[gateIndex] && gateChips[gateIndex].length) {
                        gateChips[gateIndex].forEach(function (chip) {
                            switch (typeFx) {
                                case cc.XX_FX.LOSE:
                                    cc.XXController.getInstance().playFxLost(chip);
                                    break;
                                case cc.XX_FX.DEALER_PAY:
                                    cc.XXController.getInstance().playFxDealerPay(chip);
                                    break;
                                case cc.XX_FX.PAY:
                                    cc.XXController.getInstance().playFxPay(chip);
                                    break;
                            }
                        })
                    }
                });
            } catch (e) {

            }

        },

    });
}).call(this);
