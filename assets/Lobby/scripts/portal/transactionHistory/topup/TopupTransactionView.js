/**
 * Created by Nofear on 3/15/2019.
 */

// var topupTransactionListData = require('TopupTransactionListData');

(function () {
    cc.TopupTransactionView = cc.Class({
        "extends": cc.Component,
        properties: {
            topupTransactionListView: cc.TopupTransactionListView,  
            nodePageNext: cc.Node,
            nodePagePrevious: cc.Node,
            nodeLBPage: cc.Label,      
        },

        onLoad: function () {
             this.start = 0;
          this.end = 30;
          this.index = 1;
          this.getTopupTransactionList();
          this.nodePageNext.active = true;
          this.nodePagePrevious.active = true;
        },

        getTopupTransactionList: function () {
            var topupHistoryCommand = new cc.TopupHistoryCommand;
            topupHistoryCommand.execute(this);
        },

        onTopupHistoryResponse: function (response) {
            var list = response.List;
            //list = topupTransactionListData;
            if (list !== null && list.length > 0) {
                //this.topupTransactionListView.resetList();
                //this.topupTransactionListView.initialize(list);
            console.log("Topup transaction list response:", response);

            this.datas = list;
            this.nodePagePrevious.active = true;
            if (this.datas.length > 30) {
              this.nodePageNext.active = true;
            }
             this.topupTransactionListView.resetList();
                this.topupTransactionListView.initialize(list,this.start,this.end);
                }
        },

        openKhieuNai: function () {
            cc.sys.openURL(cc.Config.getInstance().groupFB());
            cc.DDNA.getInstance().uiInteraction(cc.DDNAUILocation.PORTAL, 'FB_GROUP', cc.DDNAUIType.BUTTON);
        },
         pageNextClicked: function () {
          this.start = this.end;
          this.end += 30;
          this.index++;
          this.nodeLBPage.string = this.index;
          if (this.end > this.datas.length - 1) {
            this.nodePageNext.active = true;
          }

          this.nodePagePrevious.active = true;
          this.topupTransactionListView.resetList();
          this.topupTransactionListView.initialize(this.datas, this.start, this.end);
        },

        pagePreviousClicked: function () {
          this.start -= 30;
          this.end -= 30;
          this.index--;

        
          if (this.index <= 1) {
                    this.start = 0;
                    this.end = 5;
                    this.index = 1;
                }

          this.nodeLBPage.string = this.index;
          this.nodePageNext.active = true;
          this.topupTransactionListView.resetList();
          this.topupTransactionListView.initialize(this.datas, this.start, this.end);
        },
    });
}).call(this);
