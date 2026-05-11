/**
 * Created by Nofear on 3/15/2019.
 */

(function () {
    cc.Seven77TopJackpotView = cc.Class({
        "extends": cc.Component,
        properties: {
            seven77JackpotListView: cc.Seven77TopJackpotListView,
        },
        onLoad: function () {
            this.animation = this.node.getComponent(cc.Animation);
			this.node.zIndex = cc.NoteDepth.POPUP_TAIXIU;
        },		
		

        onEnable: function () {
			this.animation.play('openPopup');
            var self = this;
            var delay = 0.2;
            cc.director.getScheduler().schedule(function () {
                self.getList();
            }, this, 1, 0, delay, false);
        },

        getList: function () {
            var seven77GetTopCommand = new cc.Seven77GetTopCommand;
            seven77GetTopCommand.execute(this, cc.BigWinnerType.JACKPOT);
        },

        onSeven77GetTopResponse: function (response) {
            var list = response;
            if (list !== null && list.length > 0) {
                this.seven77JackpotListView.resetList();
                this.seven77JackpotListView.initialize(list);
            }
        },

        closeClicked: function () {
            this.seven77JackpotListView.resetList();
            this.animation.play('closePopup');
            var self = this;
            var delay = 0.12;
            cc.director.getScheduler().schedule(function () {
                self.animation.stop();
                cc.Seven77PopupController.getInstance().destroyTopView();
            }, this, 1, 0, delay, false);
        }
    });
}).call(this);
