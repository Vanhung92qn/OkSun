

(function () {
    var TXGetBigWinnersCommand;

    TXGetBigWinnersCommand = (function () {
        function TXGetBigWinnersCommand() {
        }

        TXGetBigWinnersCommand.prototype.execute = function (controller) {
            //Controller [HttpGet] nen dung GET; SP_Rank co DEFAULT NULL/0 cho 2 params.
            var url = 'api/luckydice/GetBigWinner';
            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.TAI_XIU, url, function (response) {
                var obj = JSON.parse(response);
                return controller.onTXGetBigWinnersResponse(obj);
            });
        };

        return TXGetBigWinnersCommand;

    })();

    cc.TXGetBigWinnersCommand = TXGetBigWinnersCommand;

}).call(this);
