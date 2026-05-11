/**
 * Created by Nofear on 3/15/2019.
 */

(function () {
    cc.TaiXiuSicboGraphDiceSumView = cc.Class({
        "extends": cc.Component,
        properties: {
            nodeGraphics: cc.Node,
            nodeParent: cc.Node,
            nodeTaiTemp: cc.Node,
            nodeXiuTemp: cc.Node,
            toggleDiceSum: cc.Toggle,
            
			sfTaiXiu: [cc.SpriteFrame],
        },

        onLoad: function () {
            this.rootPosX = -15; //toa do goc
            this.rootPosY = -88; //toa do goc
            this.spaceX = 48;
            this.spaceY = 35;

            this.maxItemPerCol = 5;

            this.minSum = 3;
            this.maxSum = 18;

            this.spacePoint = (this.spaceY * this.maxItemPerCol) / (this.maxSum - this.minSum);

            this.drawing = this.nodeGraphics.getComponent(cc.Graphics);
            this.drawing.lineWidth = 2;
            this.drawing.strokeColor = cc.Color.YELLOW;
        },

        draw: function (list) {
            list = list.slice(0,21);
            this.cacheList = list;

            this.drawPoints = [];

            var self = this;
            var index = 0;
            list.forEach(function (item) {
                self.createNode(item, index);
                index++;
            });

            this.strokeLine();
        },

        createNode: function (item, colIndex) {
            //toa do X
            var posX = this.rootPosX - (colIndex * this.spaceX);
            //toa do Y
            var posY = this.rootPosY + (item.DiceSum - this.minSum) * this.spacePoint;

            //di chuyen den doan goc
            if (colIndex === 0) {
                this.drawing.moveTo(posX, posY);

            }

            if (item.BetSide === cc.TaiXiuSicboBetSide.TAI) {
                var nodeView = cc.instantiate(this.nodeTaiTemp);
            } else {
                nodeView = cc.instantiate(this.nodeXiuTemp);
            }
            nodeView.parent = this.nodeParent;
            nodeView.position = cc.v2(posX, posY);
            if (colIndex === 0) {
                let sprite = nodeView.getComponentInChildren(cc.Sprite);
                sprite.node.active = true;
                cc.tween(sprite.node)
                            .repeatForever(
                                cc.tween().sequence(
                                    cc.tween().to(0.3, { scale: 1.5 }, { easing: cc.easing.sineOut }),
                                    cc.tween().to(0.3, { scale: 1.3 }, { easing: cc.easing.sineOut })))
                            .start();
            }

            this.drawPoints.push(cc.v2(posX, posY));
            if (item.FirstDice == item.SecondDice && item.FirstDice == item.ThirdDice && item.ThirdDice == item.SecondDice) {
                nodeView.getComponent(cc.Sprite).spriteFrame = this.sfTaiXiu[2];
            }
            else{
                nodeView.getComponent(cc.Sprite).spriteFrame = item.DiceSum <= 10 ? this.sfTaiXiu[0] : this.sfTaiXiu[1];
            }
            nodeView.getComponentInChildren(cc.Label).string = item.DiceSum + '';
        },

        strokeLine: function () {
            var self = this;
            this.drawPoints.forEach(function (point) {
                self.drawing.lineTo(point.x, point.y);
                self.drawing.stroke();
                self.drawing.moveTo(point.x, point.y);
            });
        },

        resetDraw: function () {
            //xoa cac node con
            var children = this.nodeParent.children;
            for (var i = children.length - 1; i >= 0; i--) {
                this.nodeParent.removeChild(children[i]);
            }
            this.drawing.clear();
        }

        // toggleDrawDiceSumClicked: function () {
        //     if (!this.toggleDiceSum.isChecked) {
        //         this.resetDraw();
        //     } else {
        //         this.draw(this.cacheList);
        //     }
        // },
    });
}).call(this);
