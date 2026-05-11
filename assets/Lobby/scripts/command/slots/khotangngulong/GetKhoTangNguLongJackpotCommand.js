/**
 * Created by Nofear on 2/27/2019.
 */

(function () {
    var GetKhoTangNguLongJackpotCommand;

    GetKhoTangNguLongJackpotCommand = (function () {
        function GetKhoTangNguLongJackpotCommand() {
        }

        GetKhoTangNguLongJackpotCommand.prototype.execute = function (controller) {
            var url = 'api/Game/GetBigWinner?top=50&type=' + cc.BigWinnerType.JACKPOT;

            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.KHOTANGNGULONG, url, function (response) {
                var obj = JSON.parse(response);
                return controller.onGetJackpotResponse(obj);
            });
        };

        return GetKhoTangNguLongJackpotCommand;

    })();

    cc.GetKhoTangNguLongJackpotCommand = GetKhoTangNguLongJackpotCommand;

}).call(this);
