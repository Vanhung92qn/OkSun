/**
 * Created by Nofear on 3/15/2019.
 */
var taiXiuConfig = require('TaiXiuConfig');
(function () {
    cc.TaiXiuGraphView = cc.Class({
        "extends": cc.PopupBase,
        properties: {
            taiXiuGraph100View: cc.TaiXiuGraph100View,
            taiXiuGraphCatCauView: cc.TaiXiuGraphCatCauView,
            taiXiuGraphDiceSumView: cc.TaiXiuGraphDiceSumView,
            taiXiuGraphDice3View: cc.TaiXiuGraphDice3View,

            pageView: cc.PageView,
            btnNext: cc.Button,
            btnBack: cc.Button,

            lbTotalTai: cc.Label,
            lbTotalXiu: cc.Label,
            page1: cc.Node,
            page2: cc.Node,
        },

        onLoad: function () {
            this.animation = this.node.getComponent(cc.Animation);
            this.timeSwitchPage = 0.3;
            this.totalPages = 2;
            this.currentPageIndex = this.pageView.getCurrentPageIndex();
            //this.checkStatusButton();
            this.node.zIndex = cc.NoteDepth.POPUP_TAIXIU;

           
            
        },

        onEnable: function () {
            var self = this;
            var delay = 0.2;
            cc.director.getScheduler().schedule(function () {
                self.getSoiCau();
            }, this, 1, 0, delay, false);

            this.animation.play('openPopup');
            //this.getSoiCau();
            //set tam du lieu de demo
             this.page1.active = true;
            this.page2.active = false;
             this.btnNext.node.active = true;
            this.btnBack.node.active = false;
        },

        getSoiCau: function () {
            var txGetSoiCauCommand = new cc.TXGetSoiCauCommand;
            txGetSoiCauCommand.execute(this)
        },
        resetList: function () {
            this.taiXiuGraph100View.resetDraw();
            this.taiXiuGraphCatCauView.resetDraw();
            this.taiXiuGraphDiceSumView.resetDraw();
            this.taiXiuGraphDice3View.resetDraw();
        },
        onTXGetSoiCauResponse: function (list) {
            var countTai = this.taiXiuGraph100View.draw(list);
            this.lbTotalTai.string = "Tài: " + countTai;
            this.lbTotalXiu.string = "Xỉu: " + (100 - countTai);
            this.taiXiuGraphCatCauView.draw(list);
            this.taiXiuGraphDiceSumView.draw(list);
            this.taiXiuGraphDice3View.draw(list);
        },

        pageEvent: function () {
           // this.checkStatusButton();
        },

        closeClicked: function () {
            //reset truoc khi close cho ko lag
            this.taiXiuGraph100View.resetDraw();
            this.taiXiuGraphCatCauView.resetDraw();
            this.taiXiuGraphDiceSumView.resetDraw();
            this.taiXiuGraphDice3View.resetDraw();

            this.animation.play('closePopup');
            cc.TaiXiuMainController.getInstance().destroyGraphView();
            // var self = this;
            // var delay = 0.12;
            // cc.director.getScheduler().schedule(function () {
            //     self.animation.stop();
            //     cc.TaiXiuMainController.getInstance().destroyGraphView();
            // }, this, 1, 0, delay, false);
        },

        nextPageClicked: function() {
           // this.currentPageIndex++;
           // this.pageView.scrollToPage(this.currentPageIndex, this.timeSwitchPage);
           // this.checkStatusButton();
            this.page1.active = false;
            this.page2.active = true;
            this.btnNext.node.active = false;
            this.btnBack.node.active = true;
        },

        backPageClicked: function() {
            // this.currentPageIndex--;
            // this.pageView.scrollToPage(this.currentPageIndex, this.timeSwitchPage);
            // this.checkStatusButton();

            this.page1.active = true;
            this.page2.active = false;
            this.btnNext.node.active = true;
            this.btnBack.node.active = false;
        },

        checkStatusButton: function () {
            this.currentPageIndex = this.pageView.getCurrentPageIndex();
            if (this.currentPageIndex <  this.totalPages - 1) {
                this.btnNext.interactable = true;
            } else {
                this.btnNext.interactable = false;
            }

            if (this.currentPageIndex > 0) {
                this.btnBack.interactable = true;
            } else {
                this.btnBack.interactable = false;
            }
        },
    });
}).call(this);
