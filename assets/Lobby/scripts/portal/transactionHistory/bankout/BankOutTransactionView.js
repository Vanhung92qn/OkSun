/**
 * Created by Nofear on 3/15/2019.
 */

// var bankTransactionListData = require('BankTransactionListData');

(function () {
  cc.BankOutTransactionView = cc.Class({
    extends: cc.Component,
    properties: {
      bankoutTransactionListView: cc.BankOutTransactionListView,
      nodePageNext: cc.Node,
      nodePagePrevious: cc.Node,
      nodeLBPage: cc.Label,
    },

    onLoad: function () {
      this.start = 0;
      this.end = 30;
      this.index = 1;
      this.getBankTransactionList();
      this.nodePageNext.active = true;
      this.nodePagePrevious.active = true;
    },

    getBankTransactionList: function () {
      // Doi sang QiPay withdraw history (api/QiPay/GetWithdrawHistory) thay cho bankHistoryRt cu.
      var cmd = new cc.GetQiPayWithdrawHistoryCommand();
      cmd.execute(this);
    },

    onBankHistoryResponse: function (response) {
      var list = response.List;
      // var list = bankTransactionListData;
      if (list !== null && list.length > 0) {
        this.datas = list;
        this.nodePagePrevious.active = true;
        if (this.datas.length > 30) {
          this.nodePageNext.active = true;
        }
        this.bankoutTransactionListView.resetList();
        this.bankoutTransactionListView.initialize(
          this.datas,
          this.start,
          this.end
        );
      }
    },
    pageNextClicked: function () {
      this.start = this.end;
      this.end += 30;
      this.index++;
      this.nodeLBPage.string =  this.index;
      if (this.end > this.datas.length - 1) {
        this.nodePageNext.active = true;
      }

      this.nodePagePrevious.active = true;
      this.bankoutTransactionListView.resetList();
      this.bankoutTransactionListView.initialize(this.datas, this.start, this.end);
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
      this.bankoutTransactionListView.resetList();
      this.bankoutTransactionListView.initialize(this.datas, this.start, this.end);
    },
  });
}.call(this));
