/**
 * Created by Nofear on 3/15/2019.
 */

/**
 Draw tu phai qua trai
 Draw tu duoi len tren
 */


(function () {
    cc.XXSoiCauView = cc.Class({
        "extends": cc.Component,
        properties: {
            animation: cc.Animation,

            nodeParent: cc.Node,
            nodeEvenTemp: cc.Node,
            nodeOddTemp: cc.Node,
            sfDots: [cc.SpriteFrame],
            contentDraw: cc.Node,
            iconSoiCauChanTemplate1: cc.Node,
            iconSoiCauLeTemplate2: cc.Node,
            lbCountChan: cc.Label,
            lbCountLe: cc.Label,
            lbCount4vang: cc.Label,
            lbCount4trang: cc.Label,
            lbCount3vang: cc.Label,
            lbCount3trang: cc.Label
        },

        onLoad: function () {
            cc.XXController.getInstance().setXXSoiCauView(this);

            // this.rootPosX = -9.6; //toa do goc
            // this.rootPosY = -47; //toa do goc

            this.rootPosX = -109.642; //toa do goc
            this.rootPosY = -47; //toa do goc

            this.spaceX = 19;
            this.spaceY = 30;

            this.maxItemPerCol = 4;
        },

        // convertToMatrix: function (list) {
        //     var self = this;
        //     //luu lai side dau tien
        //     var currentSide = this.getSide(list[0]);

        //     var matrix = [];
        //     var arrCols = [];
        //     list.forEach(function (item) {
        //         var itemSide = self.getSide(item);
        //         if (arrCols.length === self.maxItemPerCol) {
        //             //du 6 thi dua vao matrix + chuyen sang cot khac
        //             matrix.push(arrCols);
        //             //reset cols
        //             arrCols = [];
        //             //push vao cols
        //             arrCols.push(item);
        //             //set lai currentSide
        //             currentSide = itemSide;
        //         } else if (itemSide === currentSide) {
        //             //giong thi them vao
        //             arrCols.push(item);
        //         } else {
        //             //khac thi push vao matrix + reset cols
        //             matrix.push(arrCols);
        //             //reset cols
        //             arrCols = [];
        //             //set lai currentSide
        //             currentSide = itemSide;
        //             //push vao cols
        //             arrCols.push(item);
        //         }
        //     });

        //     //push arr cuoi vao matrix
        //     matrix.push(arrCols);
        //     return matrix;
        // },

        // getSide: function (gate) {
        //     switch (gate) {
        //         case cc.XXResult.EVEN:
        //             return 'EVEN';
        //         case cc.XXResult.EVEN_FOUR_DOWN:
        //             return 'EVEN';
        //         case cc.XXResult.EVEN_FOUR_UP:
        //             return 'EVEN';
        //         case cc.XXResult.ODD_THREE_DOWN:
        //             return 'ODD';
        //         case cc.XXResult.ODD_THREE_UP:
        //             return 'ODD';
        //     }
        // },

        // draw: function (list) {
        //     if (list.length === 0) return;
        //     // list.reverse();
        //     this.even = 0;
        //     this.fourUp = 0;
        //     this.fourDown = 0;
        //     this.odd = 0;
        //     this.threeUp = 0;
        //     this.threeDown = 0;

        //     // var list = [2,4,1,1,1,6,5,2,1,6,6,6,6,5,4,4];

        //     var matrix = this.convertToMatrix(list);
        //     var length = Math.min(matrix.length, 10);
        //     for (var i = 0; i < length; i++) {
        //         this.drawCol(matrix[i], i);
        //     }
        //     // this.nodeParent.width = Math.max(matrix.length * 40, 802);
        // },

        // drawCol: function (cols, colIndex) {
        //     //vi tri X
        //     var posX = this.rootPosX + (colIndex * this.spaceX);
        //     //toa do Y bat dau ve
        //     var starY = this.rootPosY + (this.maxItemPerCol - cols.length) * this.spaceY;

        //     for (var i = 0; i < cols.length; i++) {
        //         this.createNode(cols[i], cc.v2(posX, starY + (this.spaceY * i)));
        //     }
        // },

        // createNode: function (item, pos) {
        //     // if (this.gameAssets === undefined) {
        //     //     this.gameAssets = cc.XXController.getInstance().getAssets();
        //     // }

        //     switch (item) {
        //         case cc.XXResult.EVEN:
        //             var nodeView = cc.instantiate(this.nodeEvenTemp);
        //             this.even++;
        //             break;
        //         case cc.XXResult.EVEN_FOUR_DOWN:
        //             nodeView = cc.instantiate(this.nodeEvenTemp);
        //             this.even++;
        //             this.fourDown++;
        //             break;
        //         case cc.XXResult.EVEN_FOUR_UP:
        //             nodeView = cc.instantiate(this.nodeEvenTemp);
        //             this.even++;
        //             this.fourUp++;
        //             break;
        //         case cc.XXResult.ODD_THREE_DOWN:
        //             nodeView = cc.instantiate(this.nodeOddTemp);
        //             this.odd++;
        //             this.threeDown++;
        //             break;
        //         case cc.XXResult.ODD_THREE_UP:
        //             nodeView = cc.instantiate(this.nodeOddTemp);
        //             this.odd++;
        //             this.threeUp++;
        //             break;
        //     }

        //     nodeView.parent = this.nodeParent;
        //     nodeView.position = pos;
        //     nodeView.getComponent(cc.Sprite).spriteFrame = this.sfDots[item];

        //     //set gia tri
        //     this.lbEven.string = this.even;
        //     this.lbFourUp.string = this.fourUp;
        //     this.lbFourDown.string = this.fourDown;

        //     this.lbOdd.string = this.odd;
        //     this.lbThreeUp.string = this.threeUp;
        //     this.lbThreeDown.string = this.threeDown;
        // },

        resetDraw: function () {
            //xoa cac node con
            var children = this.nodeParent.children;
            for (var i = children.length - 1; i >= 0; i--) {
                this.nodeParent.removeChild(children[i]);
            }
        },

        // hideClicked: function () {
        //     this.animation.play('xxHideSoiCau');
        // },

        // showClicked: function () {
        //     this.animation.play('xxShowSoiCau');
        // },
        draw3: function (data) {
            //thong ke 2
            var chan = data.filter(x => x % 2 == 0).length;
            this.lbCountChan.string = chan + '';
            this.lbCountLe.string = (data.length - chan) + '';
            var bonvang = data.filter(x => x == 4).length;
            var bontrang = data.filter(x => x == 0).length;
            var bavang = data.filter(x => x == 3).length;
            var batrang = data.filter(x => x == 1).length;
            this.lbCount4vang.string = bonvang < 10 ? '0' + bonvang : bonvang + '';
            this.lbCount4trang.string = bontrang < 10 ? '0' + bontrang : bontrang + '';
            this.lbCount3vang.string = bavang < 10 ? '0' + bavang : bavang + '';
            this.lbCount3trang.string = batrang < 10 ? '0' + batrang : batrang + '';

            var startPosX = -100.5;
            var startPosY = 44.468;
            var spacingX = 50;
            var spacingY = 20;
            this.contentDraw.removeAllChildren(true);
            var data2 = [];
            var curData2 = [];
            var maxItem = 4;
            console.log('Số cột hiện tại:', data2.length, 'Tổng phần tử:', data.length);
            for (var i = data.length - 1; i >= 0; i--) {
                curData2.push(data[i]);
                if (curData2.length == maxItem) {
                    data2.push(curData2);
                    curData2 = [];
                }

            }
            for (let i = 0; i < data2.length; i++) {
                if (i % 2 == 0) {
                    for (let j = 0; j < data2[i].length; j++) {
                        let score = data2[i][j];
                        let icon = null;
                        if (score % 2 == 0) {
                            icon = cc.instantiate(this.iconSoiCauChanTemplate1);
                        }
                        else {
                            icon = cc.instantiate(this.iconSoiCauLeTemplate2);

                        }
                        icon.parent = this.contentDraw;
                        icon.setPosition(cc.v2(startPosX + spacingX * i, startPosY - spacingY * j));
                    }
                }
                else {
                    for (let j = data2[i].length - 1; j >= 0; j--) {
                        let score = data2[i][j];
                        let icon = null;
                        if (score % 2 == 0) {
                            icon = cc.instantiate(this.iconSoiCauChanTemplate1);
                        }
                        else {
                            icon = cc.instantiate(this.iconSoiCauLeTemplate2);
                        }
                        icon.parent = this.contentDraw;
                        icon.setPosition(cc.v2(startPosX + spacingX * i, startPosY - spacingY * (3 - j)));
                    }
                }

            }
        }
    });
}).call(this);
