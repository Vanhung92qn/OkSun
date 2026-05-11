

(function () {
    var TXGetHistoryJackpotCommand;

    TXGetHistoryJackpotCommand = (function () {
        function TXGetHistoryJackpotCommand() {
        }

        TXGetHistoryJackpotCommand.prototype.execute = function (controller) {
            var url = 'api/luckydice/GetJackpotsHis';

             var params = JSON.stringify({
                Paged: controller.paged,
            });

            cc.PopupController.getInstance().showBusy();

            return cc.ServerConnector.getInstance().sendRequestPOST(cc.SubdomainName.TAI_XIU, url, params,function (response) {
               // console.log(response);
                 cc.PopupController.getInstance().hideBusy();
                var obj = JSON.parse(response);
                return controller.onTXGetHistoryResponse(obj);
            });
        };

        return TXGetHistoryJackpotCommand;

    })();

    cc.TXGetHistoryJackpotCommand = TXGetHistoryJackpotCommand;

}).call(this);
