/**
 * Created by Nofear on 3/15/2019.
 */

(function () {
    cc.XXHistoryView = cc.Class({
        "extends": cc.PopupBase,
        properties: {
            listItems: cc.Node,
            listItemHistory: cc.Node,
            itemTemplateHistory: cc.Node,
            lblPage: cc.Label,
            btnNext: cc.Button,
            btnPrev: cc.Button,
            //contentDetail: cc.Node,
            nodeXXHistoryListDetailView: cc.XXHistoryListDetailView,
            nodeListJackPot: cc.Node,
            nodeListHistory: cc.Node,
            labelTitle: cc.Label,
            nodeListDetail: cc.Node,
            lblDescriptTime: cc.Label
        },

        onLoad: function () {
            console.log("XXHistoryView onLoad");
            this.type = cc.XXController.getInstance().getTypeHistory();
            cc.XXPopupController.getInstance().setXXPopupBase(this);
            this.animation = this.node.getComponent(cc.Animation);
            this.node.zIndex = cc.NoteDepth.POPUP_TAIXIU;
            if (this.type !== "history") {
                this.listItems.children.forEach(function (e) {
                    e.active = false;
                });
            } else {
                this.listItemHistory.children.forEach(function (e) {
                    e.active = false;
                });
            }
            this.maxItems = 1;
            this.btnNext.node.active = true;
            this.btnPrev.node.active = false;
            this.paged = 1;
        },

        onEnable: function () {
            console.log("XXHistoryView onEnable");
            this.type = cc.XXController.getInstance().getTypeHistory();
            console.log("type history: " + this.type);

            var self = this;
            var delay = 0.2;
            // cc.director.getScheduler().schedule(function () {
            //     self.getTopSessionWinners();
            // }, this, 1, 0, delay, false);
            self.getTopSessionWinners();
            this.animation.play('openPopup');
            if (this.type !== "history") {
                this.labelTitle.string = "Lịch sử Jackpot";
                this.nodeListJackPot.active = true;
                this.nodeListHistory.active = false;
            } else {
                this.labelTitle.string = "Lịch sử cược";
                this.nodeListJackPot.active = false;
                this.nodeListHistory.active = true;
            }
        },

        getTopSessionWinners: function () {
            var XXGetHistoryCommand = new cc.XXGetHistoryCommand;
            XXGetHistoryCommand.execute(this);
        },

        onXXGetHistoryJPResponse: function (response) {
            var list = response;
            // cc.log('list ===> ' + JSON.stringify(list))
            this.list = list;
            if (this.list !== null && this.list.length > 0) {
                this.page = 0;
                this.btnNext.node.active = true;
                this.updatePage();
            }
        },

        _mapSessions(raw) {
            const by = {};
            for (const r of raw) {
                const sid = r.SessionID;
                if (!by[sid]) {
                    by[sid] = {
                        SessionID: sid,
                        CreateTimeFm: r.CreateTimeFm || r.CreateTime,
                        GatesData: r.GatesData,
                        Bets: [],
                        _sumBet: 0, _sumAward: 0, _sumRefund: 0,
                    };
                }
                const s = by[sid];
                if (r.CreateTimeFm && r.CreateTimeFm > s.CreateTimeFm) s.CreateTimeFm = r.CreateTimeFm;

                s.Bets.push({ gate: r.GateID, bet: r.Bet || 0 });
                s._sumBet += (r.Bet || 0);
                s._sumAward += (r.Award || 0);
                s._sumRefund += (r.Refund || 0);
                s.GatesData = r.GatesData || s.GatesData;
            }

            return Object.values(by).sort((a, b) => b.SessionID - a.SessionID).map(s => ({
                SessionID: s.SessionID,
                CreateTimeFm: s.CreateTimeFm,
                Bets: s.Bets,
                ResultGate: this._pickLastGate(s.GatesData),
                GatesData: s.GatesData,
                AmountWin: s._sumAward + s._sumRefund - s._sumBet,   // <- TIỀN RÒNG
            }));
        },

        _pickLastGate(gatesData) {
            if (!gatesData) return null;
            const parts = String(gatesData).split(',');
            const last = parts[parts.length - 1].trim();
            const n = parseInt(last, 10);
            return Number.isFinite(n) ? n : null;
        },

        onXXGetHistoryResponse: function (response) {
            console.log("onXXGetHistoryResponse", response);
            const list = this._mapSessions(response);
            // console.log('list ===> ' + JSON.stringify(list));
            this.list = list;

            // clear các item cũ, giữ template
            this.listItemHistory.children.forEach(n => {
                if (n !== this.itemTemplateHistory) n.destroy();
            });

            const layout = this.listItemHistory.getComponent(cc.Layout); // nếu có Layout Vertical
            if (layout) layout.updateLayout();

            // tạo item theo data
            const count = list.length; // hoặc giới hạn per page
            for (let i = 0; i < count; i++) {
                const data = list[i];
                const row = cc.instantiate(this.itemTemplateHistory);
                row.active = true;
                row.parent = this.listItemHistory;
                row.getComponent('XXHistoryItem2').updateItem(data, i);
            }
            console.log("listItemHistory children: " + this.listItemHistory.children.length);
            // tắt paging cũ nếu không dùng
            this.lblPage.string = '1';
            this.btnPrev.node.active = false;
            this.btnNext.node.active = false;
        },

        onClickNextPage: function () {
            // console.log(this.paged);
            // if (!this.list) return;
            // var maxPage = Math.ceil(this.list.length / this.listItems.children.length);
            // if (this.page < maxPage - 1) {
            //     this.page++;
            //     this.paged++;
            //     this.getTopSessionWinners();
            //     this.updatePage();
            //     this.btnPrev.node.active = true;
            //     this.btnNext.node.active = this.page < maxPage - 1;
            // }

            this.page++;
            this.paged++;
            this.getTopSessionWinners();
            this.updatePage();
            this.btnPrev.node.active = true;
            this.btnNext.node.active = true;

        },

        onClickPrevPage: function () {
            //if (!this.list) return;
            //if (this.page > 0) {
            this.page--;
            this.paged--;
            if (this.paged < 1) {
                this.paged = 1;
            }
            this.getTopSessionWinners();
            this.updatePage();
            this.btnNext.node.active = true;
            this.btnPrev.node.active = true;
            //}
        },

        updatePage: function () {


            this.lblPage.string = `${this.paged}`;
            if (this.type !== "history") {
                for (var i = 0; i < this.listItems.children.length; i++) {
                    var itemData = this.list[i];

                    var node = this.listItems.children[i];
                    if (itemData) {
                        node.active = true;
                        var a = node.getComponent(cc.XXHistoryItem);
                        // console.log("update item: " + i, a);
                        // console.log("itemData: " + JSON.stringify(itemData));
                        // console.log("node: " + node.name);
                        a.updateItem(itemData, i);
                    } else {
                        node.active = false;
                    }
                }
            } else {
                console.log("update history item");
                console.log("listItemHistory children: " + this.listItemHistory.children.length);
                console.log("list length: " + this.list.length);
                console.log("list: " + JSON.stringify(this.list));
                for (var i = 0; i < this.listItemHistory.children.length; i++) {
                    var itemData = this.list[i];
                    var node = this.listItemHistory.children[i];
                    if (itemData) {
                        node.active = true;
                        var a = node.getComponent(cc.XXHistoryItem2);
                        // console.log("update item: " + i, a);
                        // console.log("itemData: " + JSON.stringify(itemData));
                        // console.log("node: " + node.name);
                        a.updateItem(itemData, i);
                    }
                    else {
                        node.active = false;
                    }
                }
            }



            // this.lblPage.string = `Trang ${this.page + 1}`;
            // for (var i = 0; i < this.listItems.children.length; i++) {
            //     var itemData = this.list[this.page * this.maxItems + i];

            //     var node = this.listItems.children[i];
            //     if (itemData) {
            //         node.active = true;
            //         var a = node.getComponent(cc.TaiXiuJackpotHistoryItem);
            //         a.updateItem(itemData, i);
            //     } else {
            //         node.active = false;
            //     }
            // }
        },

        updateListDetail: function (list, time) {
            this.updatelblTimeDetail(time);
            this.nodeListJackPot.active = false;
            this.nodeListDetail.active = true;
            this.nodeXXHistoryListDetailView.resetList();
            this.nodeXXHistoryListDetailView.initialize(list);
            // this.resetDetail();
            // let index = 0;
            // console.log(this.nodeTempDetail)
            // list.forEach(function (item) {
            //     let nodeTemp = cc.instantiate(this.nodeTempDetail);
            //     console.log(nodeTemp);
            //     nodeTemp.parent = this.contentDetail;
            //     nodeTemp.updateItem(item,index);
            //     index ++;

            // });

        },

        backToList: function () {
            //this.resetDetail();
            this.nodeListJackPot.active = true;
            this.nodeListDetail.active = false;
        },

        updatelblTimeDetail: function (time) {
            this.lblDescriptTime.string = cc.Tool.getInstance().convertUTCTime123(time);
        },

        //  resetDetail: function () {
        //     //xoa cac node con
        //     var children = this.contentDetail.children;
        //     for (var i = children.length - 1; i >= 0; i--) {
        //         this.contentDetail.removeChild(children[i]);
        //     }
        // },

        openHuongDan: function () {
            // tắt toàn bộ popup hiện tại
            console.log("openHuongDan");
            this.animation.play('closePopup');
            var self = this;
            var delay = 0.12;
            cc.director.getScheduler().schedule(function () {
                self.animation.stop();
                cc.XXPopupController.getInstance().destroyHistoryView();
            }, this, 1, 0, delay, false);
            // cc.XXPopupController.getInstance().createHistoryView();
        }
    });
}).call(this);
