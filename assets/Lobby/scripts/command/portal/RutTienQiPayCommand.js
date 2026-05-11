/**
 * QiPay withdraw command - POST /api/QiPay/RequestWithdraw
 * Body: { Amount, BankCode, BankAccount, BankAccountName }
 * Response: { ResponseCode:1, Orders: { Data: { withdrawId, requestId, remainBalance } } }
 *
 * Flow: client gui yeu cau -> server tru tien giu cho + tao order pending
 *       -> admin CSKH duyet -> backend tu goi QiPay ChargeOut
 *       -> callback bankout cap nhat status cuoi.
 */
(function () {
    var RutTienQiPayCommand = function () {};

    RutTienQiPayCommand.prototype.execute = function (controller) {
        var url = 'api/QiPay/RequestWithdraw';
        var payload = {
            Amount: controller.amount,
            BankCode: controller.bankCode || '',
            BankAccount: controller.editBoxBankAccNumber.string || '',
            BankAccountName: controller.editBoxBankAccName.string || ''
        };
        var params = JSON.stringify(payload);

        cc.PopupController.getInstance().showBusy();

        return cc.ServerConnector.getInstance().sendRequestPOST(
            cc.SubdomainName.PORTAL,
            url,
            params,
            function (response) {
                var obj;
                try { obj = JSON.parse(response); }
                catch (e) {
                    cc.error('[QiPay] Withdraw parse failed:', e, response);
                    cc.PopupController.getInstance().hideBusy();
                    return controller.onRutTienQiPayResponseError({ ResponseCode: -99, Message: 'Server tra ve khong hop le' });
                }

                cc.PopupController.getInstance().hideBusy();
                if (obj && obj.ResponseCode === 1) {
                    return controller.onRutTienQiPayResponse(obj);
                } else {
                    return controller.onRutTienQiPayResponseError(obj || { ResponseCode: -99, Message: 'Khong nhan duoc phan hoi' });
                }
            },
            true
        );
    };

    cc.RutTienQiPayCommand = RutTienQiPayCommand;
}).call(this);
