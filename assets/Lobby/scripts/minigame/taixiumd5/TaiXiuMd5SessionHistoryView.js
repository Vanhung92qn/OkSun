/**
 * Input dat cuoc
 */

(function () {
    cc.TaiXiuMd5SessionHistoryView = cc.Class({
        "extends": cc.Component,
        properties: {
            spriteSides:[cc.Sprite],
            sfSides: [cc.SpriteFrame],
        },

        onLoad: function () {
            cc.TaiXiuMd5Controller.getInstance().setTaiXiuMd5SessionHistoryView(this);
        },

        onDestroy: function () {
            cc.TaiXiuMd5Controller.getInstance().setTaiXiuMd5SessionHistoryView(null);
        },

        updateSessionHistory: function (md5gameHistory) {
            if (md5gameHistory) {
                this.md5gameHistory = md5gameHistory;
                cc.TaiXiuMd5Controller.getInstance().setGameHistory(md5gameHistory);
                var self = this;
                var index = 0;
                md5gameHistory.forEach(function (game) {
                    var sprite = self.spriteSides[index];
                    sprite.spriteFrame = self.sfSides[game.DiceSum > 10 ? 0 : 1];
                    //sprite.node.getComponent(cc.Button).clickEvents[0].customEventData = index;
                    if (index == 0) {
                        cc.tween(sprite.node)
                            .repeatForever(
                                cc.tween().sequence(
                                    cc.tween().to(0.3, { scale: 1.3 }, { easing: cc.easing.sineOut }),
                                    cc.tween().to(0.3, { scale: 0.8 }, { easing: cc.easing.sineOut })))
                            .start();
                    }
                    index++;
                });
            }
        },

        //Chi tiet 1 phien
        sessionDetailClicked: function (event, index) {
			var index = 0;
            if (this.md5gameHistory && this.md5gameHistory.length > index) {
                cc.TaiXiuMd5Controller.getInstance().setDetailIndex(index);
                cc.TaiXiuMd5MainController.getInstance().createSessionDetailView(0);
            }
        }
    });
}).call(this);
