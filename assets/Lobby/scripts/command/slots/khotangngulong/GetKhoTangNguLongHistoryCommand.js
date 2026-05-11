/**
 * Created by Nofear on 2/27/2019.
 */

(function () {
    var GetKhoTangNguLongHistoryCommand;

    GetKhoTangNguLongHistoryCommand = (function () {
        function GetKhoTangNguLongHistoryCommand() {
        }

        GetKhoTangNguLongHistoryCommand.prototype.execute = function (controller) {
            var url = 'api/Game/GetHistory?top=50';

            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.KHOTANGNGULONG, url, function (response) {
                var obj = JSON.parse(response);
                return controller.onGetSlotsHistoryResponse(obj);
            });
        };

        return GetKhoTangNguLongHistoryCommand;

    })();

    cc.GetKhoTangNguLongHistoryCommand = GetKhoTangNguLongHistoryCommand;

}).call(this);
