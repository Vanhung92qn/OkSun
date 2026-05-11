/**
 * QiPay Withdraw History View - Lich su rut qua QiPay.
 *
 * Reuse cc.BankOutTransactionListView de render danh sach (format response giong BankOut).
 *
 * Property keo trong Inspector:
 *   - bankoutTransactionListView : cc.BankOutTransactionListView
 *   - nodePageNext / nodePagePrevious / nodeLBPage : pagination
 *
 * Click Events trong Cocos Editor:
 *   - btn Next prev -> pageNextClicked
 *   - btn Previous  -> pagePreviousClicked
 */
(function () {
    cc.QiPayWithdrawHistoryView = cc.Class({
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
            this.datas = [];
            this.getHistory();
            if (this.nodePageNext) this.nodePageNext.active = true;
            if (this.nodePagePrevious) this.nodePagePrevious.active = true;
        },

        getHistory: function () {
            if (!cc.GetQiPayWithdrawHistoryCommand) {
                cc.error('[QiPayHis] cc.GetQiPayWithdrawHistoryCommand UNDEFINED');
                return;
            }
            var cmd = new cc.GetQiPayWithdrawHistoryCommand();
            cmd.execute(this);
        },

        // Command goi callback nay (fallback tu onBankHistoryRtResponse)
        onBankHistoryResponse: function (response) {
            var list = response.List;
            if (list && list.length > 0) {
                this.datas = list;
                if (this.nodePagePrevious) this.nodePagePrevious.active = true;
                if (this.datas.length > 30 && this.nodePageNext) this.nodePageNext.active = true;
                this.bankoutTransactionListView.resetList();
                this.bankoutTransactionListView.initialize(this.datas, this.start, this.end);
            }
        },

        pageNextClicked: function () {
            this.start = this.end;
            this.end += 30;
            this.index++;
            if (this.nodeLBPage) this.nodeLBPage.string = this.index;
            if (this.end > this.datas.length - 1 && this.nodePageNext) this.nodePageNext.active = true;
            if (this.nodePagePrevious) this.nodePagePrevious.active = true;
            this.bankoutTransactionListView.resetList();
            this.bankoutTransactionListView.initialize(this.datas, this.start, this.end);
        },

        pagePreviousClicked: function () {
            this.start -= 30;
            this.end -= 30;
            this.index--;
            if (this.index <= 1) { this.start = 0; this.end = 30; this.index = 1; }
            if (this.nodeLBPage) this.nodeLBPage.string = this.index;
            if (this.nodePageNext) this.nodePageNext.active = true;
            this.bankoutTransactionListView.resetList();
            this.bankoutTransactionListView.initialize(this.datas, this.start, this.end);
        },
    });
}.call(this));
