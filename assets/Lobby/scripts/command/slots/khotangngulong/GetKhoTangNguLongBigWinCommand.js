/**
 * Created by Nofear on 2/27/2019.
 */

(function () {
    var GetKhoTangNguLongBigWinCommand;

    GetKhoTangNguLongBigWinCommand = (function () {
        function GetKhoTangNguLongBigWinCommand() {
        }

        GetKhoTangNguLongBigWinCommand.prototype.execute = function (controller) {
            var url = 'api/Game/GetBigWinner?top=50&type=' + cc.BigWinnerType.BIG_WIN;

            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.KHOTANGNGULONG, url, function (response) {
                var obj = JSON.parse(response);
                return controller.onGetBigWinResponse(obj);
            });
        };

        return GetKhoTangNguLongBigWinCommand;

    })();

    cc.GetKhoTangNguLongBigWinCommand = GetKhoTangNguLongBigWinCommand;

}).call(this);
