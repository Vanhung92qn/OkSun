/**
 * button chuc nang (tat bat cac chuc nang phu)
 */

(function () {
    cc.TaiXiuButtonView = cc.Class({
        "extends": cc.Component,
        properties: {
            //light
            nodeLightOff: cc.Node,
            spriteLightButton: cc.Sprite,

            nodeChat: cc.Node,

            //Nan
            spriteNan: cc.Sprite,

            sfLights: [cc.SpriteFrame],
            sfNans: [cc.SpriteFrame],
            //Chat
            spriteChat: cc.Sprite,
            sfChats: [cc.SpriteFrame],
            //am thanh khi click cac nut chuc nang
            btnClickSound: cc.AudioSource,
        },

        //helper phat am thanh click, chi cho doc 1 cho
        playBtnClick: function () {
            if (this.btnClickSound) this.btnClickSound.play();
        },

        onLoad: function () {
            cc.TaiXiuController.getInstance().setTaiXiuButtonView(this);

            //light
            this.nodeLightOff.active = false;
            this.nodeLightOff.opacity = 0;
            this.animationLight = this.nodeLightOff.getComponent(cc.Animation);

            //Nan
            this.isNan = false;
            cc.TaiXiuController.getInstance().setIsNan(this.isNan);

            //Chat
            this.isChat = true;
        },

        onEnable: function () {
            var self = this;
            cc.director.getScheduler().schedule(function () {
                self.nodeChat.active = true;
            }, this, 0, 0, 2, false);
        },

        onDestroy: function () {
            cc.TaiXiuController.getInstance().setTaiXiuButtonView(null);
        },

        updateBetInfo: function (betInfo) {
            if (betInfo !== null) {
                if (betInfo.BetSide === cc.TaiXiuBetSide.TAI) {
                    this.lbBetTai.string = cc.Tool.getInstance().formatNumber(betInfo.BetValue);
                } else {
                    this.lbBetXiu.string = cc.Tool.getInstance().formatNumber(betInfo.BetValue);
                }
            } else {
                this.lbBetTai.string = 0;
                this.lbBetXiu.string = 0;
            }
        },

        lightOnEvent: function () {
            this.nodeLightOff.active = false;
        },

        //tat den
        turnOffLightClicked: function () {
            this.playBtnClick();
            this.nodeLightOff.opacity = 0;
            if (this.nodeLightOff.active) {
                this.spriteLightButton.spriteFrame = this.sfLights[0];
                this.animationLight.play('light_on');
            } else {
                this.spriteLightButton.spriteFrame = this.sfLights[1];
                this.nodeLightOff.active = true;
                this.animationLight.play('light_off');
            }
        },

        //tat bat Nan
        nanClicked: function () {
            this.playBtnClick();
            this.isNan = !this.isNan;
            this.spriteNan.spriteFrame = this.isNan ? this.sfNans[0] : this.sfNans[1];
            cc.TaiXiuController.getInstance().setIsNan(this.isNan);
        },

        //tat bat chat
        chatClicked: function () {
            this.playBtnClick();
            this.nodeChat.active = !this.nodeChat.active;
            this.isChat = !this.isChat;
            //this.spriteChat.spriteFrame = this.isChat ? this.sfChats[0] : this.sfChats[1];
        },
        //tat chat
        closeChat: function () {
            this.nodeChat.active = false;
        },

        //huong dan
        helpClicked: function () {
            this.playBtnClick();
            cc.TaiXiuMainController.getInstance().createHelpView();
        },

        //lich su dat cuoc
        historyClicked: function () {
            this.playBtnClick();
            cc.TaiXiuMainController.getInstance().createHistoryView();
        },

        //bang xep hang dat cuoc
        topClicked: function () {
            this.playBtnClick();
            cc.TaiXiuMainController.getInstance().createTopView();
        },

        //bieu do chi tiet cac phien
        graphClicked: function () {
            this.playBtnClick();
            cc.TaiXiuMainController.getInstance().createGraphView();
        },
        jackpotHistoryClicked: function () {
            this.playBtnClick();
            cc.TaiXiuMainController.getInstance().createJackpotHistoryView();
        },
        eventPHClicked: function () {
            this.playBtnClick();
            cc.TaiXiuController.getInstance().clickUIEventPH();
        }
    });
}).call(this);