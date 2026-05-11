/**
 * Created by Nofear on 6/7/2017.
 */

(function () {
    cc.AQIconView = cc.Class({
        "extends": cc.Component,
        properties: {
            skeletonDataIcons: [sp.SkeletonData],
			spriteDataIcon: [cc.SpriteFrame],
            bgRooms: [cc.SpriteFrame],
        },

        onLoad: function () {
            cc.SpinController.getInstance().setIconView(this);
        }
    });
}).call(this);
