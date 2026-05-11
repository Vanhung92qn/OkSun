/**
 * Dat cuoc
 */

(function () {
    cc.TaiXiuBetView = cc.Class({
        "extends": cc.Component,
        properties: {
            lbBetTai: cc.Label,
            lbBetXiu: cc.Label,
            bgBetTai: cc.Node,
            bgBetXiu: cc.Node,
        },

        onLoad: function () {
            cc.TaiXiuController.getInstance().setTaiXiuBetView(this);
            //this.reset();
        },

        onDestroy: function () {
            cc.TaiXiuController.getInstance().setTaiXiuBetView(null);
        },

        reset: function () {
            this.lbBetTai.string = '';
            this.lbBetXiu.string = '';
            this.bgBetTai.active = false;
            this.bgBetXiu.active = false;
        },

        updateBetInfo: function (betInfo) {
            this.betSide = betInfo.BetSide;

            if (betInfo.BetSide === cc.TaiXiuBetSide.TAI) {
                this.bgBetTai.active = true;
                this.lbBetTai.string = cc.Tool.getInstance().formatNumber(betInfo.BetValue);
            } else {
                this.bgBetXiu.active = true;
                this.lbBetXiu.string = cc.Tool.getInstance().formatNumber(betInfo.BetValue);
            }

        },

        getBetSide: function () {
            return this.betSide;
        },
    });
}).call(this);
