/**
 * Created by Nofear on 3/15/2019.
 */

(function () {
    cc.TaiXiuLivestreamTopView = cc.Class({
        "extends": cc.PopupBase,
        properties: {
            TaiXiuLivestreamTopListView: cc.TaiXiuLivestreamTopListView,
        },

        onLoad: function () {
            this.animation = this.node.getComponent(cc.Animation);
            this.node.zIndex = cc.NoteDepth.POPUP_TAIXIU;
        },

        onEnable: function () {
            var self = this;
            var delay = 0.2;
            cc.director.getScheduler().schedule(function () {
                self.getTopSessionWinners();
            }, this, 1, 0, delay, false);

            this.animation.play('openPopup');
        },

        getTopSessionWinners: function () {
            var txlivestreamGetBigWinnersCommand = new cc.TXLIVESTREAMGetBigWinnersCommand;
            txlivestreamGetBigWinnersCommand.execute(this);
        },

        onTXGetBigWinnersResponse: function (response) {
            var list = response;
            //var list = slotsHistoryListData;
            if (list !== null && list.length > 0) {
                this.TaiXiuLivestreamTopListView.resetList();
                this.TaiXiuLivestreamTopListView.initialize(list);
            }
        },

        closeClicked: function () {
            this.TaiXiuLivestreamTopListView.resetList();
            this.animation.play('closePopup');
            var self = this;
            var delay = 0.12;
            cc.director.getScheduler().schedule(function () {
                self.animation.stop();
                cc.TaiXiuLivestreamMainController.getInstance().destroyTopView();
            }, this, 1, 0, delay, false);
        },
    });
}).call(this);
