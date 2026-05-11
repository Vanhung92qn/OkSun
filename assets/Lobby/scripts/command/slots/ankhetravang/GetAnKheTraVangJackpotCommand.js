/**
 * Created by Nofear on 2/27/2019.
 */

(function () {
    var GetAnKheTraVangJackpotCommand;

    GetAnKheTraVangJackpotCommand = (function () {
        function GetAnKheTraVangJackpotCommand() {
        }

        GetAnKheTraVangJackpotCommand.prototype.execute = function (controller) {
            var url = 'api/Game/GetBigWinner?top=50&type=' + cc.BigWinnerType.JACKPOT;

            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.ANKHETRAVANG, url, function (response) {
                var obj = JSON.parse(response);
                return controller.onGetJackpotResponse(obj);
            });
        };

        return GetAnKheTraVangJackpotCommand;

    })();

    cc.GetAnKheTraVangJackpotCommand = GetAnKheTraVangJackpotCommand;

}).call(this);
