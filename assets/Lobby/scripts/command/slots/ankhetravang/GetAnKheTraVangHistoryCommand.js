/**
 * Created by Nofear on 2/27/2019.
 */

(function () {
    var GetAnKheTraVangHistoryCommand;

    GetAnKheTraVangHistoryCommand = (function () {
        function GetAnKheTraVangHistoryCommand() {
        }

        GetAnKheTraVangHistoryCommand.prototype.execute = function (controller) {
            var url = 'api/Game/GetHistory?top=50';

            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.ANKHETRAVANG, url, function (response) {
                var obj = JSON.parse(response);
                return controller.onGetSlotsHistoryResponse(obj);
            });
        };

        return GetAnKheTraVangHistoryCommand;

    })();

    cc.GetAnKheTraVangHistoryCommand = GetAnKheTraVangHistoryCommand;

}).call(this);
