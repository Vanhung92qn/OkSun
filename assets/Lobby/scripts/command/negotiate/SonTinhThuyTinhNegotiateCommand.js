/**
 * Created by Nofear on 2/27/2019.
 */

(function () {
    var SonTinhThuyTinhNegotiateCommand;

    SonTinhThuyTinhNegotiateCommand = (function () {
        function SonTinhThuyTinhNegotiateCommand() {
        }

        SonTinhThuyTinhNegotiateCommand.prototype.execute = function (controller) {
            var url = 'signalr/negotiate';
            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.SONTINHTHUYTINH, url, function (response) {

                var obj = JSON.parse(response);

                return controller.onSlotsNegotiateResponse(obj);

            }, true);
        };

        return SonTinhThuyTinhNegotiateCommand;

    })();

    cc.SonTinhThuyTinhNegotiateCommand = SonTinhThuyTinhNegotiateCommand;

}).call(this);
