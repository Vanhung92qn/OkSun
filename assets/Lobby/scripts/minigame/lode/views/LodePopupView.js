(function () {
    cc.LodePopupView = cc.Class({
        "extends": cc.PopupViewBase,
        onLoad: function () {
            cc.LodePopupController.getInstance().setPopupView(this);
        },
       
        onClickWeb: function() {
            cc.sys.openURL('https://web-sg.quayso.live/');
        }
    });
}).call(this);