

(function () {
    var TXLIVESTREAMGetBigWinnersCommand;

    TXLIVESTREAMGetBigWinnersCommand = (function () {
        function TXLIVESTREAMGetBigWinnersCommand() {
        }

        TXLIVESTREAMGetBigWinnersCommand.prototype.execute = function (controller) {
            var url = 'api/livestreamluckydice/GetBigWinner';

            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.TAI_XIU_LIVESTREAM, url, function (response) {
                var obj = JSON.parse(response);
                return controller.onTXGetBigWinnersResponse(obj);
            });
        };

        return TXLIVESTREAMGetBigWinnersCommand;

    })();

    cc.TXLIVESTREAMGetBigWinnersCommand = TXLIVESTREAMGetBigWinnersCommand;

}).call(this);
