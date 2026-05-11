/**
 * Created by Nofear on 2/27/2019.
 */

(function () {
    var GetAnKheTraVangBigWinCommand;

    GetAnKheTraVangBigWinCommand = (function () {
        function GetAnKheTraVangBigWinCommand() {
        }

        GetAnKheTraVangBigWinCommand.prototype.execute = function (controller) {
            var url = 'api/Game/GetBigWinner?top=50&type=' + cc.BigWinnerType.BIG_WIN;

            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.ANKHETRAVANG, url, function (response) {
                var obj = JSON.parse(response);
                return controller.onGetBigWinResponse(obj);
            });
        };

        return GetAnKheTraVangBigWinCommand;

    })();

    cc.GetAnKheTraVangBigWinCommand = GetAnKheTraVangBigWinCommand;

}).call(this);
