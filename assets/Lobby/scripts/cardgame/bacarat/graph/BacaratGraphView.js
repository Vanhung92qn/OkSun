/**
 * Created by Nofear on 3/15/2019.
 */
(function () {
    cc.BacaratGraphView = cc.Class({
        "extends": cc.PopupBase,
        properties: {
            pageView: cc.PageView,
            btnNext: cc.Button,
            btnBack: cc.Button,
            itemTemplate: cc.Node,
            layoutParentSoiCau: cc.Node,
            layoutParentCatCau: cc.Node,
            total : cc.Label,
            totalPlayerWin: cc.Label,
            totalBankerWin: cc.Label,
            totalPlayerPair: cc.Label,
            totalBankerPair: cc.Label,
            totalTie: cc.Label,
            percentPlayerWin: cc.Label,
            percentBankerWin: cc.Label,
            percentPlayerPair: cc.Label,
            percentBankerPair: cc.Label,
            percentTie: cc.Label
        },

        onLoad: function () {
            this.animation = this.node.getComponent(cc.Animation);
            cc.BacaratController.getInstance().setGraphView(this);
            this.itemPool = new cc.NodePool();
            this.itemPool1 = new cc.NodePool();
            for (let i = 0; i < 100; i++) {
                this.itemPool.put(cc.instantiate(this.itemTemplate));
                this.itemPool1.put(cc.instantiate(this.itemTemplate));
            }
            this.layoutParentSoiCau.width = 380;
            //this.layoutParentCatCau.width = 380;
            this.nodeRootx = -16;
            this.nodeRooty = -78;
            this.stepX = -31;
            this.stepY = 31;
            this.lengthNode = 6;
            this.list = cc.BacaratController.getInstance().getListHistory();
            this.initListSoiCau2(this.list);
            this.initListCatCau2(this.list);
            this.updateThongKe(this.list);
                       
        },

        onEnable: function () {
            var self = this;
            this.animation.play('openPopup');
            
            
        },
        initListSoiCau2: function (data) {
            if (data.length === 0) {
                return;
            }
            try {
                this.clearList();
            } catch (e) {
                console.log(e);
            }
            
            data = data.slice(0,72);
            data.map(gate => {
                let item = null;
                if(this.itemPool.size() > 0) {
                    item = this.itemPool.get();
                }else {
                    item = cc.instantiate(this.itemTemplate);
                }
                item.getComponent(cc.ItemSoiCau).setSpiteFrameItem(gate.BigGateIDWin, gate.IsPlayerPair, gate.IsBankerPair,1,true);
                //item.node.setScale(v2(1.5,1.5));
                item.parent = this.layoutParentSoiCau;
            }, this);
            this.node.active = true;
        },
        initListCatCau2: function (data) {
            if (data.length === 0) {
                return;
            }       
            try {
                this.clearListCatCau();
            } catch (e) {
                console.log(e);
            }
    
            //convert matrix
            let col = 0;
            let dataCol = [];
            dataCol[col] = [];
            dataCol[col].push(data[0]);
            for (let i = 1; i < data.length; i++) {
                if (dataCol[col][0].BigGateIDWin != data[i].BigGateIDWin || dataCol[col].length === this.lengthNode) {
                    col++;
                    dataCol[col] = [];
                }
                dataCol[col].push(data[i]);
            }
            this.draw(dataCol);
            this.node.active = true;
        },
        draw: function (data) {
            data = data = data.slice(0,29);
            let width = data.length * 44.15;
            width = (width < 420) ? 420 : width;
            this.layoutParentCatCau.width = width;
            this.layoutParentCatCau.height = 188;
            data.map((dataCol, indexCol) => {
                var nodeRootyTemp = this.nodeRooty + ((6-dataCol.length) * this.stepY);
                dataCol.map((gate, indexNode) => {
                    let posX = this.stepX * indexCol + this.nodeRootx;
                    let posY = nodeRootyTemp + indexNode * this.stepY;
                    let node = null;
                    if (this.itemPool1.size() > 0) {
                        node = this.itemPool1.get();
                    } else {
                        node = cc.instantiate(this.itemTemplate);
                    }
                    let itemSoiCau = node.getComponent(cc.ItemSoiCau);
    
    
                    itemSoiCau.setSpiteFrameItem(gate.BigGateIDWin, gate.IsPlayerPair, gate.IsBankerPair,2,true);
    
                    //itemSoiCau.setScore(gate.HandValue);
                    node.parent = this.layoutParentCatCau;
                    node.position = cc.v2(posX, posY);
                }, this);
            }, this);
        },
        clearList: function () {
            let nodes = this.layoutParentSoiCau.children;
            if(nodes.length > 0) {
                nodes.map(item => {
                    this.itemPool.put(item);
                }, this);
            }
            this.layoutParentSoiCau.removeAllChildren(true);
        },
        clearListCatCau: function () {
            let nodes = this.layoutParentCatCau.children;
            if(nodes.length > 0) {
                nodes.map(item => {
                    this.itemPool1.put(item);
                }, this);
            }
            this.layoutParentCatCau.removeAllChildren(true);
        },
        closeClicked: function () {
            //reset truoc khi close cho ko lag

            this.animation.play('closePopup');
            var self = this;
            var delay = 0.12;
            cc.director.getScheduler().schedule(function () {
                self.animation.stop();
                cc.BacaratPopupController.getInstance().destroyHistorySoiCauView();
                cc.BacaratController.getInstance().setGraphView(null);
            }, this, 1, 0, delay, false);
        },
        updateThongKe(data){
            if (data.length === 0) {
                return;
            }
            data = data.slice(0,72);
            let total = 72;
            let totalPlayerWin = 0;
            let totalBankerWin = 0;
            let totalPlayerPair = 0;
            let totalBankerPair = 0;
            let totalTie = 0;
            data.map(gate => {
                if (gate.BigGateIDWin == 2) {
                    totalPlayerWin += 1;
                }
                else if(gate.BigGateIDWin == 3){
                    totalTie += 1;
                }
                else{
                    totalBankerWin += 1;
                }

                if (gate.IsPlayerPair) {
                    totalPlayerPair += 1;
                }
                if (gate.IsBankerPair) {
                    totalBankerPair += 1;
                }               
            }, this);
            this.totalPlayerWin.string = '' +  totalPlayerWin;
            this.totalBankerWin.string = '' +  totalBankerWin;
            this.totalPlayerPair.string = '' +  totalPlayerPair;
            this.totalBankerPair.string = '' +  totalBankerPair;
            this.totalTie.string = '' +  totalTie;
            this.percentPlayerWin.string = '' +  (totalPlayerWin*100/total).toFixed(2) + '%';
            this.percentBankerWin.string = '' +  (totalBankerWin*100/total).toFixed(2) + '%';
            this.percentPlayerPair.string = '' +  (totalPlayerPair*100/total).toFixed(2) + '%';
            this.percentBankerPair.string = '' +  (totalBankerPair*100/total).toFixed(2) + '%';
            this.percentTie.string = '' +  (totalTie*100/total).toFixed(2) + '%';
            this.total.string = '' + total;
        }
    });
}).call(this);
