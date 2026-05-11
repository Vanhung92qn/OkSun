/**
 * Created by Nofear on 3/15/2019.
 */


(function () {
    cc.DragonTigerSessionItem = cc.Class({
        "extends": cc.Component,
        properties: {
            bg:cc.Sprite,
            sfIcon: [cc.SpriteFrame]
        },

        updateItem: function(rs) {
            switch (rs) {
                case cc.DragonTigerBetSide.HOA:
                    this.bg.spriteFrame = this.sfIcon[0];
                    break;
                case cc.DragonTigerBetSide.RONG:
                    this.bg.spriteFrame = this.sfIcon[1];
                    break;
                case cc.DragonTigerBetSide.HO:
                    this.bg.spriteFrame = this.sfIcon[2];
                    break;
            
                default:
                    break;
            }
        },
    });
}).call(this);
