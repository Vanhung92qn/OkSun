/**
 * Created by Nofear on 2/27/2019.
 */

(function () {
    var KhoTangNguLongNegotiateCommand;

    KhoTangNguLongNegotiateCommand = (function () {
        function KhoTangNguLongNegotiateCommand() {
        }

        KhoTangNguLongNegotiateCommand.prototype.execute = function (controller) {
            var url = 'signalr/negotiate';
            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.KHOTANGNGULONG, url, function (response) {

                var obj = JSON.parse(response);

                return controller.onSlotsNegotiateResponse(obj);

            }, true);
        };

        return KhoTangNguLongNegotiateCommand;

    })();

    cc.KhoTangNguLongNegotiateCommand = KhoTangNguLongNegotiateCommand;

}).call(this);
