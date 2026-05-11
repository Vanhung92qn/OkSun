/**
 * QiPay get bank list - GET /api/QiPay/BankList
 * Response: { ResponseCode:1, Orders: { List: [{code:'VCB', name:'Vietcombank'}, ...] } }
 */
(function () {
    var GetQiPayBankListCommand = function () {};

    GetQiPayBankListCommand.prototype.execute = function (controller) {
        var url = 'api/QiPay/BankList';

        return cc.ServerConnector.getInstance().sendRequest(
            cc.SubdomainName.PORTAL,
            url,
            function (response) {
                var obj;
                try { obj = JSON.parse(response); }
                catch (e) {
                    cc.error('[QiPay] BankList parse failed:', e, response);
                    return controller.onGetQiPayBankListError && controller.onGetQiPayBankListError({ ResponseCode: -99, Message: 'Server tra ve khong hop le' });
                }

                if (obj && obj.ResponseCode === 1) {
                    return controller.onGetQiPayBankListResponse(obj);
                } else {
                    if (controller.onGetQiPayBankListError) controller.onGetQiPayBankListError(obj);
                    else cc.PopupController.getInstance().showMessageError((obj && obj.Message) ? obj.Message : 'Loi lay danh sach ngan hang');
                }
            }
        );
    };

    cc.GetQiPayBankListCommand = GetQiPayBankListCommand;
}).call(this);
