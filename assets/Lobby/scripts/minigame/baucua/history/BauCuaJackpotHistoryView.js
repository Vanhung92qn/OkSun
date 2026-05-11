/**
 * Created by Nofear on 3/15/2019.
 */

cc.BauCuaJackpotHistoryView = cc.Class({
    "extends": cc.PopupBase,
    properties: {
        listItems: cc.Node,
        lblPage: cc.Label,
        lblPercentBau: cc.Label,
        lblPercentCua: cc.Label,
        lblPercentTom: cc.Label,
        lblPercentCa: cc.Label,
        lblPercentGa: cc.Label,
        lblPercentNai: cc.Label,
        btnNext: cc.Button,
        btnPrev: cc.Button,
        listjp: cc.Node,
        detail: cc.Node,
        listItemsDetail: cc.Node,
        detailtime: cc.Label,
        tempItemsDetail: cc.Node,
    },

    onLoad: function () {
        this.animation = this.node.getComponent(cc.Animation);
        this.node.zIndex = cc.NoteDepth.POPUP_TAIXIU;
        this.listItems.children.forEach(function (e) {
            e.active = false;
        });
        this.maxItems = 5;
        this.maxItemsdetail = 20;
        this.btnNext.node.active = true;
        this.btnPrev.node.active = true;
        this.paged = 1;
    },

    onEnable: function () {
        // var self = this;
        // var delay = 0;
        // cc.director.getScheduler().schedule(function () {
        //     self.getTopSessionWinners();
        // }, this, 1, 0, delay, false);
        this.getTopSessionWinners();
        this.animation.play('openPopup');
    },

    getTopSessionWinners: function () {
        var BauCuaGetHistoryJackpotCommand = new cc.BauCuaGetHistoryJackpotCommand;
        //this.paged = this.page;
       // console.log(this.paged);
        BauCuaGetHistoryJackpotCommand.execute(this);
    },

    onBauCuaGetHistoryResponse: function (response) {
        //console.log(response);
        // this.list = response;
       // console.log(response);
        // response = {
        //     percentTai: 51,
        //     percentXiu: 49,
        //     list: [
        //         {
        //             session: 12312,
        //             time: "2000-20-20 20:30",
        //             result: "Tài",
        //             userCount: 50,
        //             jackpot: 200000,
        //             vinhDanh: [
        //                 { nickname: "Nickname1", coin: 1000000 },
        //                 { nickname: "Nickname2", coin: 1000000 },
        //                 { nickname: "Nickname3", coin: 1000000 },
        //                 { nickname: "Nickname4", coin: 1000000 },
        //                 { nickname: "Nickname5", coin: 1000000 },
        //                 { nickname: "Nickname6", coin: 1000000 },
        //                 { nickname: "Nickname7", coin: 1000000 },
        //                 { nickname: "Nickname8", coin: 1000000 },
        //                 { nickname: "Nickname9", coin: 1000000 },
        //                 { nickname: "Nickname10", coin: 1000000 },
        //                 { nickname: "Nickname11", coin: 1000000 },
        //                 { nickname: "Nickname12", coin: 1000000 },
        //                 { nickname: "Nickname13", coin: 1000000 },
        //                 { nickname: "Nickname14", coin: 1000000 },
        //                 { nickname: "Nickname15", coin: 1000000 },
        //                 { nickname: "Nickname16", coin: 1000000 },
        //                 { nickname: "Nickname17", coin: 1000000 },
        //                 { nickname: "Nickname18", coin: 1000000 },
        //                 { nickname: "Nickname19", coin: 1000000 },
        //                 { nickname: "Nickname20", coin: 1000000 }
        //             ]
        //         },
        //         {
        //             session: 12313,
        //             time: "2000-20-20 20:30",
        //             result: "Xỉu",
        //             userCount: 50,
        //             jackpot: 200000,
        //             vinhDanh: [
        //                 { nickname: "Nickname1", coin: 1000000 },
        //                 { nickname: "Nickname2", coin: 1000000 },
        //                 { nickname: "Nickname3", coin: 1000000 },
        //                 { nickname: "Nickname4", coin: 1000000 },
        //                 { nickname: "Nickname5", coin: 1000000 },
        //                 { nickname: "Nickname6", coin: 1000000 },
        //                 { nickname: "Nickname7", coin: 1000000 },
        //                 { nickname: "Nickname8", coin: 1000000 },
        //                 { nickname: "Nickname9", coin: 1000000 },
        //                 { nickname: "Nickname10", coin: 1000000 },
        //                 { nickname: "Nickname11", coin: 1000000 },
        //                 { nickname: "Nickname12", coin: 1000000 },
        //                 { nickname: "Nickname13", coin: 1000000 },
        //                 { nickname: "Nickname14", coin: 1000000 },
        //                 { nickname: "Nickname15", coin: 1000000 },
        //                 { nickname: "Nickname16", coin: 1000000 },
        //                 { nickname: "Nickname17", coin: 1000000 },
        //                 { nickname: "Nickname18", coin: 1000000 },
        //                 { nickname: "Nickname19", coin: 1000000 },
        //                 { nickname: "Nickname20", coin: 1000000 }
        //             ]
        //         },
        //         {
        //             session: 12314,
        //             time: "2000-20-20 20:30",
        //             percentTai: 51,
        //             percentXiu: 49,
        //             result: "Tài",
        //             userCount: 50,
        //             jackpot: 200000,
        //             vinhDanh: [
        //                 { nickname: "Nickname1", coin: 1000000 },
        //                 { nickname: "Nickname2", coin: 1000000 },
        //                 { nickname: "Nickname3", coin: 1000000 },
        //                 { nickname: "Nickname4", coin: 1000000 },
        //                 { nickname: "Nickname5", coin: 1000000 },
        //                 { nickname: "Nickname6", coin: 1000000 },
        //                 { nickname: "Nickname7", coin: 1000000 },
        //                 { nickname: "Nickname8", coin: 1000000 },
        //                 { nickname: "Nickname9", coin: 1000000 },
        //                 { nickname: "Nickname10", coin: 1000000 },
        //                 { nickname: "Nickname11", coin: 1000000 },
        //                 { nickname: "Nickname12", coin: 1000000 },
        //                 { nickname: "Nickname13", coin: 1000000 },
        //                 { nickname: "Nickname14", coin: 1000000 },
        //                 { nickname: "Nickname15", coin: 1000000 },
        //                 { nickname: "Nickname16", coin: 1000000 },
        //                 { nickname: "Nickname17", coin: 1000000 },
        //                 { nickname: "Nickname18", coin: 1000000 },
        //                 { nickname: "Nickname19", coin: 1000000 },
        //                 { nickname: "Nickname20", coin: 1000000 }
        //             ]
        //         },
        //         {
        //             session: 12315,
        //             time: "2000-20-20 20:30",
        //             percentTai: 51,
        //             percentXiu: 49,
        //             result: "Tài",
        //             userCount: 50,
        //             jackpot: 200000,
        //             vinhDanh: [
        //                 { nickname: "Nickname1", coin: 1000000 },
        //                 { nickname: "Nickname2", coin: 1000000 },
        //                 { nickname: "Nickname3", coin: 1000000 },
        //                 { nickname: "Nickname4", coin: 1000000 },
        //                 { nickname: "Nickname5", coin: 1000000 },
        //                 { nickname: "Nickname6", coin: 1000000 },
        //                 { nickname: "Nickname7", coin: 1000000 },
        //                 { nickname: "Nickname8", coin: 1000000 },
        //                 { nickname: "Nickname9", coin: 1000000 },
        //                 { nickname: "Nickname10", coin: 1000000 },
        //                 { nickname: "Nickname11", coin: 1000000 },
        //                 { nickname: "Nickname12", coin: 1000000 },
        //                 { nickname: "Nickname13", coin: 1000000 },
        //                 { nickname: "Nickname14", coin: 1000000 },
        //                 { nickname: "Nickname15", coin: 1000000 },
        //                 { nickname: "Nickname16", coin: 1000000 },
        //                 { nickname: "Nickname17", coin: 1000000 },
        //                 { nickname: "Nickname18", coin: 1000000 },
        //                 { nickname: "Nickname19", coin: 1000000 },
        //                 { nickname: "Nickname20", coin: 1000000 }
        //             ]
        //         },
        //         {
        //             session: 12316,
        //             time: "2000-20-20 20:30",
        //             percentTai: 51,
        //             percentXiu: 49,
        //             result: "Tài",
        //             userCount: 50,
        //             jackpot: 200000,
        //             vinhDanh: [
        //                 { nickname: "Nickname1", coin: 1000000 },
        //                 { nickname: "Nickname2", coin: 1000000 },
        //                 { nickname: "Nickname3", coin: 1000000 },
        //                 { nickname: "Nickname4", coin: 1000000 },
        //                 { nickname: "Nickname5", coin: 1000000 },
        //                 { nickname: "Nickname6", coin: 1000000 },
        //                 { nickname: "Nickname7", coin: 1000000 },
        //                 { nickname: "Nickname8", coin: 1000000 },
        //                 { nickname: "Nickname9", coin: 1000000 },
        //                 { nickname: "Nickname10", coin: 1000000 },
        //                 { nickname: "Nickname11", coin: 1000000 },
        //                 { nickname: "Nickname12", coin: 1000000 },
        //                 { nickname: "Nickname13", coin: 1000000 },
        //                 { nickname: "Nickname14", coin: 1000000 },
        //                 { nickname: "Nickname15", coin: 1000000 },
        //                 { nickname: "Nickname16", coin: 1000000 },
        //                 { nickname: "Nickname17", coin: 1000000 },
        //                 { nickname: "Nickname18", coin: 1000000 },
        //                 { nickname: "Nickname19", coin: 1000000 },
        //                 { nickname: "Nickname20", coin: 1000000 }
        //             ]
        //         }
        //     ]
        // };

        this.list = response.JackpotList;
        this.lblPercentBau.string = `${response.RateGourd}` + "%";
        this.lblPercentCua.string = `${response.RateCrab}` + "%";
        this.lblPercentTom.string = `${response.RateShrimp}` + "%";
        this.lblPercentCa.string = `${response.RateFish}` + "%";
        this.lblPercentGa.string = `${response.RateChicken}` + "%";
        this.lblPercentNai.string = `${response.RateDeer}` + "%";
        //var list = slotsHistoryListData;
        if (this.list !== null && this.list.length > 0) {
            this.page = 0;
            this.btnNext.node.active = true;
            this.updatePage();
        }
    },

    closeClicked: function () {
        this.animation.play('closePopup');
        var self = this;
        var delay = 0.12;
        cc.director.getScheduler().schedule(function () {
            self.animation.stop();
            cc.BauCuaPopupController.getInstance().destroyHistoryJackpotView();
        }, this, 1, 0, delay, false);
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
            if(this.paged < 1){
                this.paged = 1;
            }
            this.getTopSessionWinners();
            this.updatePage();
            this.btnNext.node.active = true;
            this.btnPrev.node.active = true;
        //}
    },
    onClickBack: function () {
       this.detail.active = false;
       this.listjp.active = true;
    },
    viewmore(target,data){
        if (this.list !== null && this.list.length > 0) {
            this.detail.active = true;
            this.listjp.active = false;
            for (var i = 0; i < this.list.length ; i++) {
                if(this.list[i].SessionId == data){
                    this.detailtime.string =  cc.Tool.getInstance().convertUTCTime(this.list[i].CreatedDate);
                    let datadetail = this.list[i].ListUser;
                    
                    for (var j = 0; j < datadetail.length; j++) {

                        var itemData = datadetail[this.page * this.maxItemsdetail + j];

                        var node = this.listItemsDetail.children[j];
                        if (itemData) {
                            node.active = true;
                            var a = node.getComponent(cc.BauCuaJackpotHistoryDetailItem);
                            a.updateItem(itemData, j);
                        } else {
                            node.active = false;
                        }


                        //  var item = cc.instantiate(this.itemTemplate);
                        // this.listItemsDetail.addChild(item);
                        // item.getComponent(cc.BauCuaJackpotHistoryDetailItem).updateItem(datadetail[i], i);
                        // this.items.push(item);


                        // var item = this.tempItemsDetail[j].getComponent(cc.BauCuaJackpotHistoryDetailItem);
                        // item.updateItem(datadetail[j], j);
                        // var itemData = datadetail[j];
                        // var node = this.listItemsDetail.children[j];
                        // if (itemData) {
                        //     var a = node.getComponent(cc.BauCuaJackpotHistoryDetailItem);
                        //     a.updateItem(itemData, j);
                        // }
                    }

                }
            }
        }

    },
    updatePage: function () {

       
        this.lblPage.string = `${this.paged}`;
        for (var i = 0; i < this.listItems.children.length; i++) {
            var itemData = this.list[this.page * this.maxItems + i];

            var node = this.listItems.children[i];
            if (itemData) {
                node.active = true;
                var a = node.getComponent(cc.BauCuaJackpotHistoryItem);
                a.updateItem(itemData, i);
            } else {
                node.active = false;
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
});
