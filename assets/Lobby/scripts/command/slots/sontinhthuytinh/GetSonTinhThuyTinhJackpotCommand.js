/**
 * Created by Nofear on 2/27/2019.
 */

(function () {
    var GetSonTinhThuyTinhJackpotCommand;

    GetSonTinhThuyTinhJackpotCommand = (function () {
        function GetSonTinhThuyTinhJackpotCommand() {
        }

        GetSonTinhThuyTinhJackpotCommand.prototype.execute = function (controller) {
            var url = 'api/Game/GetBigWinner?top=50&type=' + cc.BigWinnerType.JACKPOT;

            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.SONTINHTHUYTINH, url, function (response) {
                var obj = JSON.parse(response);
                return controller.onGetJackpotResponse(obj);
            });
        };

        return GetSonTinhThuyTinhJackpotCommand;

    })();

    cc.GetSonTinhThuyTinhJackpotCommand = GetSonTinhThuyTinhJackpotCommand;

}).call(this);
