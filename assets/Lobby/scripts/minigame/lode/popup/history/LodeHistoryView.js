(function () {
    cc.LodeHistoryView = cc.Class({
        "extends": cc.PopupBase,
        properties: {
            historyListView: cc.LodeHistoryListView,
            nodePageNext: cc.Node,
            nodePagePrevious: cc.Node,
            nodeLBPage: cc.Label,
        },

        onLoad: function () {
            this.start = 0;
            this.end = 6;
            this.index = 1;
            this.datas = [];
            this.animation = this.node.getComponent(cc.Animation);
            this.node.zIndex = cc.NoteDepth.POPUP_TAIXIU;
            this.node.parent = cc.find('Canvas');
        },

        onEnable: function () {
            var self = this;
            var delay = 0.2;
            cc.director.getScheduler().schedule(function () {
                self.getHistory();
            }, this, 1, 0, delay, false);

            this.animation.play('openPopup');
        },

        getHistory: function () {
            var getHistoryCommand = new cc.LodeHistoryCommand;
            getHistoryCommand.execute(this);
        },

        onGetHistoryResponse: function (response) {
            var list = response;
            //var list = slotsHistoryListData;

            if (list !== null && list.length > 0) {
                this.datas = list;
                this.nodePagePrevious.active = false;
                if (list.length > 6) {
                    this.nodePageNext.active = true;
                }
                this.historyListView.resetList();
                this.historyListView.initialize(this.datas, this.start, this.end);
            }
        },

        pageNextClicked: function () {
            this.start = this.end;
            this.end += 6;
            this.index++;
            this.nodeLBPage.string = this.index + '';
            if (this.end > this.datas.length - 1) {
                this.nodePageNext.active = false;
            }

            this.nodePagePrevious.active = true;
            this.historyListView.resetList();
            this.historyListView.initialize(this.datas, this.start, this.end);
        },

        pagePreviousClicked: function () {
            this.start -= 6;
            this.end -= 6;
            this.index--;
            if (this.start <= 0) {
                this.start = 0;
                this.nodePagePrevious.active = false;
            }
            if (this.end <= 0) {
                this.end = 0;
            }
            if (this.index <= 1) {
                this.index = 1;
            }
            this.nodeLBPage.string = "" + this.index;
            this.nodePageNext.active = true;
            this.historyListView.resetList();
            this.historyListView.initialize(this.datas, this.start, this.end);
        },

        closeClicked: function () {
            this.historyListView.resetList();
            this.animation.play('closePopup');
            var self = this;
            var delay = 0.12;
            cc.director.getScheduler().schedule(function () {
                self.animation.stop();
                cc.LodePopupController.getInstance().destroyHistoryView();
                this.node.removeFromParent();
            }, this, 1, 0, delay, false);
        },
    });
}).call(this);
