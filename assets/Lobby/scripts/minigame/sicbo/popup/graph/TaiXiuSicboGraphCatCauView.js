/**
 * Created by Nofear on 3/15/2019.
 */

/**
    Draw tu phai qua trai
    Draw tu duoi len tren
 */


(function () {
    cc.TaiXiuSicboGraphCatCauView = cc.Class({
        "extends": cc.Component,
        properties: {
            nodeParent: cc.Node,
            nodeTaiTemp: cc.Node,
            nodeXiuTemp: cc.Node,
            nodeBaoTemp: cc.Node,

            sfTaiXiu: [cc.SpriteFrame],
        },

        onLoad: function () {
            this.rootPosX = -25; //toa do goc
            this.rootPosY = -76.5; //toa do goc
            this.spaceX = 43.8;
            this.spaceY = 35;

            this.maxItemPerCol = 5;
        },

        convertToMatrix: function (list) {
            var self = this;
            //luu lai side dau tien
            var currentSide = list[0].BetSide;

            var matrix = [];
            var arrCols = [];
            list.forEach(function (item) {
                if (arrCols.length === self.maxItemPerCol) {
                    //du 6 thi dua vao matrix + chuyen sang cot khac
                    matrix.push(arrCols);
                    //reset cols
                    arrCols = [];
                    //push vao cols
                    arrCols.push(item);
                    //set lai currentSide
                    currentSide = item.BetSide;
                } else if (item.BetSide === currentSide) {
                    //giong thi them vao
                    arrCols.push(item);
                } else {
                    //khac thi push vao matrix + reset cols
                    matrix.push(arrCols);
                    //reset cols
                    arrCols = [];
                    //set lai currentSide
                    currentSide = item.BetSide;
                    //push vao cols
                    arrCols.push(item);
                }
            });

            //push arr cuoi vao matrix
            matrix.push(arrCols);

            return matrix;
        },

        draw: function (list) {
            var matrix = this.convertToMatrix(list);
            for (var i = 0; i < matrix.length; i++) {
                this.drawCol(matrix[i], i);
            }
            this.nodeParent.width = Math.max(matrix.length * 20, 954);
        },

        drawCol: function (cols, colIndex) {
            //vi tri X
            var posX = this.rootPosX - (colIndex * this.spaceX);
            //toa do Y bat dau ve
            var starY = this.rootPosY + (this.maxItemPerCol - cols.length) * this.spaceY;

            for (var i = 0; i < cols.length; i++) {
                this.createNode(cols[i], cc.v2(posX, starY + (this.spaceY * i)),colIndex);
            }
        },

        createNode: function (item, pos,index) {
            if (item.BetSide === cc.TaiXiuSicboBetSide.TAI) {
                var nodeView = cc.instantiate(this.nodeTaiTemp);
            } else {
                nodeView = cc.instantiate(this.nodeXiuTemp);
            }
            nodeView.parent = this.nodeParent;
            nodeView.position = pos;
            if (item.FirstDice == item.SecondDice && item.FirstDice == item.ThirdDice && item.ThirdDice == item.SecondDice) {
                nodeView.getComponent(cc.Sprite).spriteFrame = this.sfTaiXiu[2];
            }
            else{
                nodeView.getComponent(cc.Sprite).spriteFrame = item.DiceSum <= 10 ? this.sfTaiXiu[0] : this.sfTaiXiu[1];
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
