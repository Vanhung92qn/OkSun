/**
 * Created by Nofear on 2/27/2019.
 */

(function () {
    var AnKheTraVangNegotiateCommand;

    AnKheTraVangNegotiateCommand = (function () {
        function AnKheTraVangNegotiateCommand() {
        }

        AnKheTraVangNegotiateCommand.prototype.execute = function (controller) {
            var url = 'signalr/negotiate';
            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.ANKHETRAVANG, url, function (response) {

                var obj = JSON.parse(response);

                return controller.onSlotsNegotiateResponse(obj);

            }, true);
        };

        return AnKheTraVangNegotiateCommand;

    })();

    cc.AnKheTraVangNegotiateCommand = AnKheTraVangNegotiateCommand;

}).call(this);
