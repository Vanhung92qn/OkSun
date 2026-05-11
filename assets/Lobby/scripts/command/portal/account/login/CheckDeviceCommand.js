/**
 * Created by Nofear on 2/27/2019.
 */

(function () {
    var CheckDeviceCommand;

    CheckDeviceCommand = (function () {
        function CheckDeviceCommand() {
        }

        CheckDeviceCommand.prototype.execute = function (controller) {
            var url = 'api/Account/CheckDevice';

            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.PORTAL, url, function (response) {
                var obj = JSON.parse(response);
               // console.log(response);
                cc.PopupController.getInstance().hideBusy();
                return controller.onCheckDeviceResponse(obj);
            });
        };

        return CheckDeviceCommand;

    })();

    cc.CheckDeviceCommand = CheckDeviceCommand;

}).call(this);
