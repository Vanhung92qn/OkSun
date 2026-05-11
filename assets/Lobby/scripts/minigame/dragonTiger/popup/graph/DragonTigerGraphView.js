/**
 * Created by Nofear on 3/15/2019.
 */

(function () {
    cc.DragonTigerGraphView = cc.Class({
        "extends": cc.PopupBase,
        properties: {
            contentDraw: cc.Node,
            conttentScroll: cc.Node,
            nodeRongTemp: cc.Node,
            nodeHoaTemp: cc.Node,
            nodeHoTemp: cc.Node,
            nodeResulRongTemp: cc.Node,
            nodeResulHoaTemp: cc.Node,
            nodeResulHoTemp: cc.Node,

            lbTotalRong: cc.Label,
            lbTotalHoa: cc.Label,
            lbTotalHo: cc.Label,
            percentHo: cc.Label,
            percentRong: cc.Label,
            progressHo: cc.ProgressBar
        },

        onLoad: function () {
            this.resetDraw();
            this.resetScroll();
            this.animation = this.node.getComponent(cc.Animation);
            this.node.zIndex = cc.NoteDepth.POPUP_TAIXIU;
        },

        onEnable: function () {
            var self = this;
            var delay = 0.2;
            cc.director.getScheduler().schedule(function () {
                self.getSoiCau();
            }, this, 1, 0, delay, false);

            this.animation.play('openPopup');

            //set tam du lieu de demo
        },

        getSoiCau: function () {
            var dragonTigerGetSoiCauCommand = new cc.DragonTigerGetSoiCauCommand;
            dragonTigerGetSoiCauCommand.execute(this)
        },

        onDragonTigerGetSoiCauResponse: function (list) {
            list = list.slice(0,45);
            let thongke = this.draw(list);
            this.updateThongke(thongke);
        },
        updateThongke:function(thongke){
            this.lbTotalRong.string = thongke.rong + '';
            this.lbTotalHoa.string = thongke.hoa + '';
            this.lbTotalHo.string = thongke.ho + '';
            let totalRongHo = thongke.rong + thongke.ho
            let progressRong = thongke.rong/totalRongHo;
            let progressHo = thongke.ho/totalRongHo;
            this.progressHo.progress = progressHo;
            this.percentHo.string = Math.floor(progressHo*100) +  '%';
            this.percentRong.string = (100 - Math.floor(progressHo*100))+  '%';
            let widthHo = 550*progressHo;
            let widthRong = 550-widthHo;
            this.percentHo.node.setPosition(-widthRong*0.5 + widthHo/6,6);
            this.percentRong.node.setPosition(widthHo*0.5 - widthRong/6,6);
        },
        draw: function (list) {
            var countRong = 0;
            var countHoa = 0;
            var countHo = 0;
            var self = this;
            let index = 0;
            list.forEach(function (item) {
                switch (item.Result) {
                    case cc.DragonTigerBetSide.RONG:
                        countRong++;
                        self.createNode(self.nodeRongTemp,self.contentDraw,index);
                        self.createNodeScroll(self.nodeResulRongTemp,self.conttentScroll);
                        break;
                    case cc.DragonTigerBetSide.HOA:
                        countHoa++;
                        self.createNode(self.nodeHoaTemp,self.contentDraw,index);
                        self.createNodeScroll(self.nodeResulHoaTemp,self.conttentScroll);
                        break;
                    case cc.DragonTigerBetSide.HO:
                        countHo++;
                        self.createNode(self.nodeHoTemp,self.contentDraw,index);
                        self.createNodeScroll(self.nodeResulHoTemp,self.conttentScroll);
                        break;
                }
                index ++;
            });
            let listCount = {rong: countRong, hoa: countHoa, ho: countHo};
            return listCount;
        },
        createNode: function (nodeTemp,nodeparent,index) {
            var nodeView = cc.instantiate(nodeTemp);
            if (index && index == 44) {
                cc.tween(nodeView)
                            .repeatForever(
                                cc.tween().sequence(
                                    cc.tween().to(0.3, { scale: 1.1 }, { easing: cc.easing.sineOut }),
                                    cc.tween().to(0.3, { scale: 1 }, { easing: cc.easing.sineOut })))
                            .start();
            }
            nodeView.parent = nodeparent;
        },
        createNodeScroll: function (nodeTemp,nodeparent) {
            var nodeView = cc.instantiate(nodeTemp);
            nodeparent.addChild(nodeView);
            nodeView.setPosition(0,-23);
            //nodeView.parent = nodeparent;
        },

        resetDraw: function () {
            //xoa cac node con
            var children = this.contentDraw.children;
            for (var i = children.length - 1; i >= 0; i--) {
                this.contentDraw.removeChild(children[i]);
            }
        },
        resetScroll: function () {
            //xoa cac node con
            var children = this.conttentScroll.children;
            for (var i = children.length - 1; i >= 0; i--) {
                this.conttentScroll.removeChild(children[i]);
            }
        },

        closeClicked: function () {
            //reset truoc khi close cho ko lag

            this.animation.play('closePopup');
            var self = this;
            var delay = 0.12;
            this.resetDraw();
            this.resetScroll();
            cc.director.getScheduler().schedule(function () {
                self.animation.stop();
                cc.DragonTigerPopupController.getInstance().destroyGraphView();
            }, this, 1, 0, delay, false);
        }
    });
}).call(this);
