/**
 * Created by Nofear on 3/15/2019.
 */


(function () {
    cc.BacaratTopItem = cc.Class({
        "extends": cc.Component,
        properties: {
            // sprite: cc.Sprite,

            lbRank: cc.Label,
            lbSID: cc.Label,
            lbNickName: cc.Label,
            lbTotalWin: cc.Label,
            spriteTop: cc.Sprite,
            spTop: [cc.SpriteFrame],
            fontName: cc.Font
        },

        updateItem: function(item, itemID) {
            // this.sprite.enabled = itemID % 2 !== 0;
            var color = cc.Color.WHITE;
            if(itemID < 3) {
                this.lbRank.node.active = false;
                this.spriteTop.node.active = true;
                this.spriteTop.spriteFrame = this.spTop[itemID];
                this.lbNickName.node.color = color.fromHEX("#F5E207");
                this.lbTotalWin.font = this.fontName;
            }else {
                this.lbRank.node.active = true;
                this.spriteTop.node.active = false;
                this.lbRank.string = itemID + 1;
            }

            this.lbSID.string = cc.Config.getInstance().getServiceNameNoFormat(item.ServiceID);
            this.lbNickName.string = item.DisplayName;
            this.lbTotalWin.string = cc.Tool.getInstance().formatMoney(item.Award);

            this.item = item;
            this.itemID = itemID;
        },
    });
}).call(this);
