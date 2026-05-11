/**
 * Created by Nofear on 3/15/2019.
 */


(function () {
    cc.XXHistoryItem = cc.Class({
        "extends": cc.Component,
        properties: {
            //bg: cc.Node,
            //line: cc.Node,
            lblTime: cc.Label,
            lblResult: cc.Node,
            iconResult: cc.Sprite,
            lblJackpot: cc.Label,
            sfIcon: [cc.SpriteFrame],
            vinhDanh: cc.Node,
            btnMore: cc.Button
        },

        updateItem(itemData, idx) {
            console.log("updateItem", itemData, idx);
            this.lblTime.string = cc.Tool.getInstance().convertUTCTime(itemData.CreatedDate);

            this.lblJackpot.string = cc.Tool.getInstance().formatNumber(itemData.JackPot);
            this.getRs(itemData.GatesData);

            this.btnMore.node.off("click");
            this.btnMore.node.active = true;

            this.btnMore.node.on("click", function () {
                cc.XXPopupController.getInstance().updateListDetailJackPot(itemData.VinhDanh, itemData.CreatedDate);
            }.bind(this));

            // this.vinhDanh.getChildByName("1").setSiblingIndex(this.vinhDanh.childrenCount - 1);
            // this.vinhDanh.getChildByName("1").active = true;
        },

        update() {
            //this.bg.height = this.node.height - 12;
            //this.line.height = this.bg.height;
        },
        getRs: function (gateData) {
            let listGate = gateData.split(',');
            let gate = Number(listGate[listGate.length - 1]);
            let frame = new cc.SpriteFrame();
            let index = 0;

            switch (gate) {
                case 1:
                    frame = this.sfIcon[1];
                    index = 1;
                    break;
                case 2:
                    frame = this.sfIcon[2];
                    index = 2;
                    break;
                case 3:
                    frame = this.sfIcon[3];
                    index = 3;
                    break;
                case 4:
                    frame = this.sfIcon[0];
                    index = 4;
                    break;
                case 5:
                    frame = this.sfIcon[5];
                    index = 5;
                    break;
                case 6:
                    frame = this.sfIcon[4];
                    index = 6;
                    break;

                default:
                    break;
            }
            for (var i = 0; i < this.lblResult.children.length; i++) {
                var node = this.lblResult.children[i].getComponent(cc.Sprite);
                node.spriteFrame = frame;
            }
            //this.iconResult.spriteFrame = this.sfIcon[index];
        }
    });
}).call(this);
