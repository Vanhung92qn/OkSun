/**
 * Created by Nofear on 3/15/2019.
 */

(function () {
    cc.TaiXiuSicboGraph100View = cc.Class({
        "extends": cc.Component,
        properties: {
            nodeParent: cc.Node,
            nodeTaiTemp: cc.Node,
            nodeXiuTemp: cc.Node,
            nodeBaoTemp: cc.Node,
            sfTaiXiu:[cc.SpriteFrame],
        },

        draw: function (list) {
            var countTai = 0;
            var index = 0;
            var self = this;
            list.forEach(function (item) {
                if (item.BetSide === cc.TaiXiuSicboBetSide.TAI) {
                    countTai++;
                    self.createNode(self.nodeTaiTemp,item,index);
                } else {
                    self.createNode(self.nodeXiuTemp,item,index);
                }
                index ++;
                
            });
            return countTai;
        },

        createNode: function (nodeTemp,item,index) {
            var nodeView = cc.instantiate(nodeTemp);
            nodeView.parent = this.nodeParent;
            if (item.FirstDice == item.SecondDice && item.FirstDice == item.ThirdDice && item.ThirdDice == item.SecondDice) {
                nodeView.getComponent(cc.Sprite).spriteFrame = this.sfTaiXiu[2];
            }
            nodeView.getComponentInChildren(cc.Label).string = item.DiceSum + '';
            if (index === 0) {
                let sprite = nodeView.getComponentInChildren(cc.Sprite);
                sprite.node.active = true;
                cc.tween(sprite.node)
                            .repeatForever(
                                cc.tween().sequence(
                                    cc.tween().to(0.3, { scale: 1.5 }, { easing: cc.easing.sineOut }),
                                    cc.tween().to(0.3, { scale: 1.3 }, { easing: cc.easing.sineOut })))
                            .start();
            }
        },

        resetDraw: function () {
            //xoa cac node con
            var children = this.nodeParent.children;
            for (var i = children.length - 1; i >= 0; i--) {
                this.nodeParent.removeChild(children[i]);
            }
        },
    });
}).call(this);
