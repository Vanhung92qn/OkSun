(function () {
    var UsergetTotalBetIndayCommand;

    UsergetTotalBetIndayCommand = (function () {
        function UsergetTotalBetIndayCommand() {
        }

        UsergetTotalBetIndayCommand.prototype.execute = function (controller) {
            var url = 'api/Account/GetTotalBetInDay';

            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.PORTAL, url, function (response) {
                var obj = JSON.parse(response);
                return controller.onTotalBetInday(obj);
            });
        };

        return UsergetTotalBetIndayCommand;

    })();

    cc.UsergetTotalBetIndayCommand = UsergetTotalBetIndayCommand;

}).call(this);