(function () {
    var UserMissionCommand;

    UserMissionCommand = (function () {
        function UserMissionCommand() {
        }

        UserMissionCommand.prototype.execute = function (controller) {
            var url = 'api/Event/GetEvent';

            return cc.ServerConnector.getInstance().sendRequest(cc.SubdomainName.PORTAL, url, function (response) {
                var obj = JSON.parse(response);
                return controller.onUserMissionResponse(obj);
            });
        };

        return UserMissionCommand;

    })();

    cc.UserMissionCommand = UserMissionCommand;

}).call(this);