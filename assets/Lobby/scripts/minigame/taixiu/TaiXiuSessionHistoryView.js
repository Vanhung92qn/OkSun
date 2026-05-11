/**
 * Input dat cuoc
 */

(function () {
    cc.TaiXiuSessionHistoryView = cc.Class({
        "extends": cc.Component,
        properties: {
            spriteSides: [cc.Sprite],
            sfSides: [cc.SpriteFrame],
            sfLightSides: [cc.SpriteFrame],
            dotlight: cc.Node,
            lbSum: cc.Label,
        },

        onLoad: function () {
            cc.TaiXiuController.getInstance().setTaiXiuSessionHistoryView(this);
            // Khi user tat-mo UI giua phien, server khong gui lai history cho toi het phien tiep theo.
            // Render tu cache controller -> thay duoc cau ngay khi mount.
            var cached = cc.TaiXiuController.getInstance().getGameHistory();
            if (cached && cached.length) {
                this.updateSessionHistory(cached);
            }
        },

        onDestroy: function () {
            cc.TaiXiuController.getInstance().setTaiXiuSessionHistoryView(null);
        },

        enabledotlight: function () {
            this.dotlight.active = true;
            this.lbSum.node.active = true;
            cc.tween(this.dotlight)
                .repeatForever(
                    cc.tween().sequence(
                        cc.tween().to(0.3, { scale: 1.3 }, { easing: cc.easing.sineOut }),
                        cc.tween().to(0.3, { scale: 0.8 }, { easing: cc.easing.sineOut })))
                .start();
        },
        disbledotlight: function () {
            this.dotlight.active = true;
            this.lbSum.node.active = true;
        },
        updateSessionHistory: function (gameHistory) {
            //console.log(gameHistory);
            // cc.log('history ==>' + JSON.stringify(gameHistory));

            if (gameHistory) {
                this.gameHistory = gameHistory;
                cc.TaiXiuController.getInstance().setGameHistory(gameHistory);
                var self = this;
                var index = 0;
                var k = 0;
                // gameHistory = gameHistory.reverse();
                // cc.log('historyREVER ==>' + JSON.stringify(gameHistory));
                // gameHistory.forEach(function (game) {
                //     k++;
                //     if (k <= 13) {
                //         var sprite = self.spriteSides[index];
                //         sprite.spriteFrame = self.sfSides[game.DiceSum > 10 ? 0 : 1];
                //         // sprite.node.getComponent(cc.Button).clickEvents[0].customEventData = index;
                //         // if (index == 0) {
                //         //     cc.tween(sprite.node)
                //         //         .repeatForever(
                //         //             cc.tween().sequence(
                //         //                 cc.tween().to(0.3, { scale: 1.3 }, { easing: cc.easing.sineOut }),
                //         //                 cc.tween().to(0.3, { scale: 0.8 }, { easing: cc.easing.sineOut })))
                //         //         .start();
                //         // }
                //         if(k == 13){
                //             self.dotlight.getComponent(cc.Sprite).spriteFrame = self.sfLightSides[game.DiceSum > 10 ? 0 : 1];
                //         }
                //     }
                //     index++;
                // });

                // co 13 node, 15 data lich su
                this.spriteSides.forEach(function (spr, index) {
                    spr.spriteFrame = self.sfSides[gameHistory[index].DiceSum > 10 ? 0 : 1];
                    if (index == 0) {
                        self.dotlight.getComponent(cc.Sprite).spriteFrame = self.sfLightSides[gameHistory[index].DiceSum > 10 ? 0 : 1];
                        self.lbSum.string = gameHistory[index].DiceSum;
                        if(gameHistory[index].DiceSum>10){
                            self.lbSum.node.color = new cc.Color(255,255,255)
                        }else self.lbSum.node.color = new cc.Color(0,0,0)
                    }
                });
            }
        },

        //Chi tiet 1 phien
        sessionDetailClicked: function (event, index) {
            var index = 0;
            if (this.gameHistory && this.gameHistory.length > index) {
                cc.TaiXiuController.getInstance().setDetailIndex(index);
                cc.TaiXiuMainController.getInstance().createSessionDetailView(0);
            }
        }
    });
}).call(this);
