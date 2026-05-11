/**
 * QiPay Deposit History View - Lich su nap qua QiPay.
 *
 * Reuse cc.BankTransactionListView de render danh sach (format response giong BankCharge).
 *
 * Property keo trong Inspector:
 *   - bankTransactionListView : cc.BankTransactionListView (giong BankTransactionView)
 *   - nodePageNext / nodePagePrevious / nodeLBPage : pagination
 *
 * Click Events trong Cocos Editor:
 *   - btn Next prev -> pageNextClicked
 *   - btn Previous  -> pagePreviousClicked
 */
(function () {
    cc.QiPayDepositHistoryView = cc.Class({
        extends: cc.Component,
        properties: {
            bankTransactionListView: cc.BankTransactionListView,
            nodePageNext: cc.Node,
            nodePagePrevious: cc.Node,
            nodeLBPage: cc.Label,
        },

        onLoad: function () {
            this.start = 0;
            this.end = 30;
            this.index = 1;
            this.datas = [];
            this.getHistory();
            if (this.nodePageNext) this.nodePageNext.active = true;
            if (this.nodePagePrevious) this.nodePagePrevious.active = true;
        },

        getHistory: function () {
            if (!cc.GetQiPayDepositHistoryCommand) {
                cc.error('[QiPayHis] cc.GetQiPayDepositHistoryCommand UNDEFINED');
                return;
            }
            var cmd = new cc.GetQiPayDepositHistoryCommand();
            cmd.execute(this);
        },

        onBankHistoryResponse: function (response) {
            var list = response.List;
            if (list && list.length > 0) {
                this.datas = list;
                if (this.nodePagePrevious) this.nodePagePrevious.active = true;
                if (this.datas.length > 30 && this.nodePageNext) this.nodePageNext.active = true;
                this.bankTransactionListView.resetList();
                this.bankTransactionListView.initialize(this.datas, this.start, this.end);
            }
        },

        pageNextClicked: function () {
            this.start = this.end;
            this.end += 30;
            this.index++;
            if (this.nodeLBPage) this.nodeLBPage.string = this.index;
            if (this.end > this.datas.length - 1 && this.nodePageNext) this.nodePageNext.active = true;
            if (this.nodePagePrevious) this.nodePagePrevious.active = true;
            this.bankTransactionListView.resetList();
            this.bankTransactionListView.initialize(this.datas, this.start, this.end);
        },

        pagePreviousClicked: function () {
            this.start -= 30;
            this.end -= 30;
            this.index--;
            if (this.index <= 1) { this.start = 0; this.end = 30; this.index = 1; }
            if (this.nodeLBPage) this.nodeLBPage.string = this.index;
            if (this.nodePageNext) this.nodePageNext.active = true;
            this.bankTransactionListView.resetList();
            this.bankTransactionListView.initialize(this.datas, this.start, this.end);
        },
    });
}.call(this));
