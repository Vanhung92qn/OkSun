(function () {
    var UserNhanKhuyenMai;

    UserNhanKhuyenMai = (function () {
        function UserNhanKhuyenMai() {
        }

        UserNhanKhuyenMai.prototype.execute = function (controller) {
            var url = 'api/BankCharge/CreateKhuyenMai';
            var params = JSON.stringify({
                Amount:2000,
            });
            //console.log(params);
            cc.PopupController.getInstance().showBusy();
            return cc.ServerConnector.getInstance().sendRequestPOST(cc.SubdomainName.PORTAL, url, params, function (response) {
                //console.log(response);
                var obj = JSON.parse(response);
                if (obj.ResponseCode === 1) {
                    return controller.onUserNhanKhuyenMaiResponse(obj);
                } else {
                    return controller.onUserNhanKhuyenMaiResponseError(obj);

                }
            });
        };
        return UserNhanKhuyenMai;

    })();
    cc.UserNhanKhuyenMai = UserNhanKhuyenMai;

}).call(this);