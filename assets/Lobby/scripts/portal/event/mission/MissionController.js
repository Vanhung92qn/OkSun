(function () {
    var MissionController;

    MissionController = (function () {
        var instance;

        function MissionController() {
        }

        instance = void 0;

        MissionController.getInstance = function () {
            if (instance === void 0) {
                instance = this;
            }
            return instance.prototype;
        };

        MissionController.prototype.setMissionView = function (missionView) {
            return this.missionView = missionView;
        };

        MissionController.prototype.getMission = function () {
            return this.missionView.getMission();
        };
        MissionController.prototype.closePopup = function () {
            return this.missionView.closeClicked();
        };
        MissionController.prototype.getIndex = function () {
            return this.missionView.tabSelectedIdx;
        };

        return MissionController;

    })();

    cc.MissionController = MissionController;

}).call(this);