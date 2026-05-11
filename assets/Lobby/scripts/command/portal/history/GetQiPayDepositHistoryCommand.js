/**
 * Lay lich su NAP qua QiPay - GET /api/QiPay/GetDepositHistory
 * Response: { ResponseCode:1, List:[{ RequestDate, RequestID, RequestType, AmountGame, BankName, Status, StatusStr }, ...] }
 *
 * Reuse format giong BankHistory de cc.BankTransactionItem render duoc.
 */
(function () {
    var GetQiPayDepositHistoryCommand = function () {};

    GetQiPayDepositHistoryCommand.prototype.execute = function (controller) {
        var url = 'api/QiPay/GetDepositHistory';

        return cc.ServerConnector.getInstance().sendRequest(
            cc.SubdomainName.PORTAL,
            url,
            function (response) {
                var obj;
                try { obj = JSON.parse(response); }
                catch (e) {
                    cc.error('[QiPayHis] deposit parse fail:', e, response);
                    return;
                }
                if (obj && obj.ResponseCode === 1) {
                    return controller.onBankHistoryResponse(obj);
                } else {
                    cc.PopupController.getInstance().showMessageError((obj && obj.Message) || 'Loi lay lich su nap', obj && obj.ResponseCode);
                }
            }
        );
    };

    cc.GetQiPayDepositHistoryCommand = GetQiPayDepositHistoryCommand;
}).call(this);
