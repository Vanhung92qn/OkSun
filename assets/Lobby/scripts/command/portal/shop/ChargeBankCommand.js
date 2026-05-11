/**
 * Created by Nofear on 3/19/2019.
 */

(function () {
    var ChargeBankCommand;

    ChargeBankCommand = (function () {
        function ChargeBankCommand() {
        }

        ChargeBankCommand.prototype.execute = function (controller) {
            var url = 'api/MopayBank/GetBank?bankCode=' +controller.bankCode;
            if (controller.type) {
                var params = JSON.stringify({
                    Bankcode: controller.bankCode,
                    BankName: controller.lbSelectedBank.string,
                    Type: controller.type,
                    PrivateKey: cc.ServerConnector.getInstance().getCaptchaPrivateKey(),
                });
            } else {
                var params = JSON.stringify({
                    Bankcode: controller.bankCode,
                    BankName: controller.lbSelectedBank.string,
                    PrivateKey: cc.ServerConnector.getInstance().getCaptchaPrivateKey(),
                    OperatorID: controller.operatorID
                });
            }

            cc.PopupController.getInstance().showBusy();

            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.PORTAL, url, function (response) {
                //console.log(response);
                var obj = JSON.parse(response);

                cc.PopupController.getInstance().hideBusy();

                if (obj.ResponseCode === 1) {
                    //========
                    return controller.onChargeBankResponse(obj);
                } else {
                    return controller.onChargeBankResponseError(obj);

                }

            });
        };

        return ChargeBankCommand;

    })();

    cc.ChargeBankCommand = ChargeBankCommand;

}).call(this);
