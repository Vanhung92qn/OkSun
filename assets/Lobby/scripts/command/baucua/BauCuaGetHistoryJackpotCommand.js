

(function () {
    var BauCuaGetHistoryJackpotCommand;

    BauCuaGetHistoryJackpotCommand = (function () {
        function BauCuaGetHistoryJackpotCommand() {
        }

        BauCuaGetHistoryJackpotCommand.prototype.execute = function (controller) {
            var url = 'api/BauCua/GetJackpotsHis';

             var params = JSON.stringify({
                Paged: controller.paged,
            });

            cc.PopupController.getInstance().showBusy();

            return cc.ServerConnector.getInstance().sendRequestPOST(cc.SubdomainName.BAUCUA, url, params,function (response) {
              // console.log(response);
                 cc.PopupController.getInstance().hideBusy();
                var obj = JSON.parse(response);
                return controller.onBauCuaGetHistoryResponse(obj);
            });
        };

        return BauCuaGetHistoryJackpotCommand;

    })();

    cc.BauCuaGetHistoryJackpotCommand = BauCuaGetHistoryJackpotCommand;

}).call(this);
