/**
 * Created by Nofear on 7/14/2017.
 */

(function () {
    cc.SoiCauView = cc.Class({
        "extends": cc.Component,
        properties: {
            nodeBanner: cc.Node,
            nodeBanner2: cc.Node,
            nodeBanner3: cc.Node,
            nodeswichR:cc.Sprite,
            nodeswichL:cc.Sprite,
            sfSwitch:[cc.SpriteFrame]
        },

        onLoad: function () {
            this.timePerPage = 3;
            this.timeSwitchPage = 1;

            this.pageView = this.node.getComponent(cc.PageView);
            this.totalPages = this.pageView.content.children.length;
            this.currentPageIndex = this.pageView.getCurrentPageIndex();
            this.checkEnable();
        },
        switchPage: function() {
            this.currentPageIndex = this.pageView.getCurrentPageIndex();
            if (this.currentPageIndex === this.totalPages - 1) {
                this.currentPageIndex = 0;
            } else {
                this.currentPageIndex++;
            }           
            this.pageView.scrollToPage(this.currentPageIndex, this.timeSwitchPage);
            this.checkEnable();
        },
        checkEnable(){
            if (this.currentPageIndex === this.totalPages - 1) {
                this.nodeswichR.spriteFrame = this.sfSwitch[0];
                this.nodeswichL.spriteFrame = this.sfSwitch[1];
            } else if(this.currentPageIndex === 0) {
                this.nodeswichL.spriteFrame = this.sfSwitch[0];
                this.nodeswichR.spriteFrame = this.sfSwitch[1];
            }
            else{
                this.nodeswichL.spriteFrame = this.sfSwitch[1];
                this.nodeswichR.spriteFrame = this.sfSwitch[1];
            }
        }
    });

}).call(this);