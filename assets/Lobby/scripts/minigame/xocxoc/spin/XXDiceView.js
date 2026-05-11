(function () {
    cc.XXDiceView = cc.Class({
        "extends": cc.Component,
        properties: {
            sfDices: [cc.SpriteFrame],
        },

        onLoad: function () {
            // console.log("XXDiceView onLoad");
            cc.XXSpinController.getInstance().setXXDiceView(this);
        }
    });
}).call(this);