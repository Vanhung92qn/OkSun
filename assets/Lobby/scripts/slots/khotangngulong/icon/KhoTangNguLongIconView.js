/**
 * Created by Nofear on 6/7/2017.
 */

(function () {
    cc.KhoTangNguLongIconView = cc.Class({
        "extends": cc.Component,
        properties: {
            skeletonDataIcons: [sp.SkeletonData],
            bgRooms: [cc.SpriteFrame],
            skeleton: [sp.Spine],
        },

        onLoad: function () {
            cc.SpinController.getInstance().setIconView(this);
        }
    });
}).call(this);
