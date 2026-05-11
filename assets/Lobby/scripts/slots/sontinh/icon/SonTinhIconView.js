/**
 * Created by Nofear on 6/7/2017.
 */

(function () {
    cc.SonTinhIconView = cc.Class({
        "extends": cc.Component,
        properties: {
            skeletonDataIcons: [sp.SkeletonData],
            spriteDataIcons: [cc.SpriteFrame],
            bgRooms: [cc.SpriteFrame],
        },

        onLoad: function () {
            cc.SpinController.getInstance().setIconView(this);
        }
    });
}).call(this);
