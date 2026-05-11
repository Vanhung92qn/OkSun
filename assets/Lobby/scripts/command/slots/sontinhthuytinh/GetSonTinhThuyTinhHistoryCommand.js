/**
 * Created by Nofear on 2/27/2019.
 */

(function () {
    var GetSonTinhThuyTinhHistoryCommand;

    GetSonTinhThuyTinhHistoryCommand = (function () {
        function GetSonTinhThuyTinhHistoryCommand() {
        }

        GetSonTinhThuyTinhHistoryCommand.prototype.execute = function (controller) {
            var url = 'api/Game/GetHistory?top=50';

            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.SONTINHTHUYTINH, url, function (response) {
                var obj = JSON.parse(response);
                return controller.onGetSlotsHistoryResponse(obj);
            });
        };

        return GetSonTinhThuyTinhHistoryCommand;

    })();

    cc.GetSonTinhThuyTinhHistoryCommand = GetSonTinhThuyTinhHistoryCommand;

}).call(this);
