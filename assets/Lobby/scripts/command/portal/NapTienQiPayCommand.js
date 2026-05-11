/**
 * QiPay deposit command - goi Portal /api/QiPay/RequestDeposit
 * Server tu dong chon ngan hang qua QiPay (chargeType=bank), khong can chon bank tay.
 */
(function () {
    var NapTienQiPayCommand = function () {};

    NapTienQiPayCommand.prototype.execute = function (controller) {
        var url = 'api/QiPay/RequestDeposit';
        var params = {
            Amount: controller.VarAmount
        };

        var paramsStr = JSON.stringify(params);

        return cc.ServerConnector.getInstance().sendRequestPOST(
            cc.SubdomainName.PORTAL,
            url,
            paramsStr,
            function (response) {
                var obj;
                try {
                    obj = JSON.parse(response);
                } catch (e) {
                    cc.error('[QiPay] Parse response failed:', e, response);
                    cc.PopupController.getInstance().hideBusy();
                    return controller.onNapTienQiPayResponseError({
                        ResponseCode: -99,
                        Message: 'Server tra ve khong hop le'
                    });
                }

                cc.PopupController.getInstance().hideBusy();
                if (obj && obj.ResponseCode === 1) {
                    return controller.onNapTienQiPayResponse(obj);
                } else {
                    return controller.onNapTienQiPayResponseError(obj || {
                        ResponseCode: -99,
                        Message: 'Khong nhan duoc phan hoi'
                    });
                }
            },
            true
        );
    };

    cc.NapTienQiPayCommand = NapTienQiPayCommand;
}).call(this);
