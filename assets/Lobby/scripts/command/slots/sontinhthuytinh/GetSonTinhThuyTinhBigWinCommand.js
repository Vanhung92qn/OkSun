/**
 * Created by Nofear on 2/27/2019.
 */

(function () {
    var GetSonTinhThuyTinhBigWinCommand;

    GetSonTinhThuyTinhBigWinCommand = (function () {
        function GetSonTinhThuyTinhBigWinCommand() {
        }

        GetSonTinhThuyTinhBigWinCommand.prototype.execute = function (controller) {
            var url = 'api/Game/GetBigWinner?top=50&type=' + cc.BigWinnerType.BIG_WIN;

            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.SONTINHTHUYTINH, url, function (response) {
                var obj = JSON.parse(response);
                return controller.onGetBigWinResponse(obj);
            });
        };

        return GetSonTinhThuyTinhBigWinCommand;

    })();

    cc.GetSonTinhThuyTinhBigWinCommand = GetSonTinhThuyTinhBigWinCommand;

}).call(this);
