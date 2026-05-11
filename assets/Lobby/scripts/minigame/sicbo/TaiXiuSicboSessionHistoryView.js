/**
 * Input dat cuoc
 */

(function () {
    cc.TaiXiuSicboSessionHistoryView = cc.Class({
        "extends": cc.Component,
        properties: {
            spriteSides:[cc.Sprite],
            sfSides: [cc.SpriteFrame],
        },

        onLoad: function () {
            cc.TaiXiuSicboController.getInstance().setTaiXiuSicboSessionHistoryView(this);
        },

        onDestroy: function () {
            cc.TaiXiuSicboController.getInstance().setTaiXiuSicboSessionHistoryView(null);
        },

        updateSessionHistory: function (sicbogameHistory) {
            if (sicbogameHistory) {
                this.sicbogameHistory = sicbogameHistory;
                cc.TaiXiuSicboController.getInstance().setGameHistory(sicbogameHistory);
                var self = this;
                var index = 0;
                sicbogameHistory.forEach(function (game) {
                    if (index <= 10) {
                        var sprite = self.spriteSides[index];
                        sprite.spriteFrame = self.sfSides[game.DiceSum > 10 ? 0 : 1];
                        //sprite.node.getComponent(cc.Button).clickEvents[0].customEventData = index; 
                        if (index == 0) {
                            cc.tween(sprite.node.getChildByName("dot-outline"))
                            .repeatForever(
                                cc.tween().sequence(
                                    cc.tween().to(0.5, { scale: 1.2 }, { easing: cc.easing.sineOut }),
                                    cc.tween().to(0.5, { scale: 1.1 }, { easing: cc.easing.sineOut })))
                            .start();
                        }
                    }
                    
                    index++;
                });
            }
        },

        //Chi tiet 1 phien
        sessionDetailClicked: function (event, index) {
			var index = 0;
            if (this.sicbogameHistory && this.sicbogameHistory.length > index) {
                cc.TaiXiuSicboController.getInstance().setDetailIndex(index);
                cc.TaiXiuSicboMainController.getInstance().createSessionDetailView(0);
            }
        }
    });
}).call(this);
