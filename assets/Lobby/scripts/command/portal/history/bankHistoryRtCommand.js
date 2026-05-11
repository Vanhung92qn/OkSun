/**
 * Created by Nofear on 3/20/2019.
 */

(function () {
    var bankHistoryRtCommand;

    bankHistoryRtCommand = (function () {
        function bankHistoryRtCommand() {
        }

        bankHistoryRtCommand.prototype.execute = function (controller) {

            var url = 'api/BankCharge/GetHistoryRut'; //32//

            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.PORTAL, url, function (response) {
                var obj = JSON.parse(response);
                if (obj.ResponseCode === 1) {
                    return controller.onBankHistoryResponse(obj);
                } else {
                    cc.PopupController.getInstance().showMessageError(obj.Message, obj.ResponseCode);
                }
            });
        };

        return bankHistoryRtCommand;

    })();

    cc.bankHistoryRtCommand = bankHistoryRtCommand;

}).call(this);
