/**
 * Lay lich su RUT qua QiPay - GET /api/QiPay/GetWithdrawHistory
 * Response: { ResponseCode:1, List:[{ RequestDate, RequestID, RequestType, AmountGame, BankName, Status, StatusStr, BankAccount, BankAccountName }, ...] }
 *
 * Reuse format giong BankOutHistory de cc.BankOutTransactionItem render duoc.
 */
(function () {
    var GetQiPayWithdrawHistoryCommand = function () {};

    GetQiPayWithdrawHistoryCommand.prototype.execute = function (controller) {
        var url = 'api/QiPay/GetWithdrawHistory';

        return cc.ServerConnector.getInstance().sendRequest(
            cc.SubdomainName.PORTAL,
            url,
            function (response) {
                var obj;
                try { obj = JSON.parse(response); }
                catch (e) {
                    cc.error('[QiPayHis] withdraw parse fail:', e, response);
                    return;
                }
                if (obj && obj.ResponseCode === 1) {
                    return controller.onBankHistoryRtResponse
                        ? controller.onBankHistoryRtResponse(obj)
                        : controller.onBankHistoryResponse(obj);
                } else {
                    cc.PopupController.getInstance().showMessageError((obj && obj.Message) || 'Loi lay lich su rut', obj && obj.ResponseCode);
                }
            }
        );
    };

    cc.GetQiPayWithdrawHistoryCommand = GetQiPayWithdrawHistoryCommand;
}).call(this);
