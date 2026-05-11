/**
 * Created by Nofear on 3/14/2019.
 */


(function () {
    cc.HelpView = cc.Class({
        "extends": cc.Component,
        properties: {
            pageView: cc.PageView,
        },

        onLoad: function () {
            this.animation = this.node.getComponent(cc.Animation);
        },

        onEnable: function () {
            this.animation.play('openPopup');
        },

        closeClicked: function () {
            this.animation.play('closePopup');
            var self = this;
            var delay = 0.12;
            cc.director.getScheduler().schedule(function () {
                self.animation.stop();
                cc.MainController.getInstance().destroyHelpView();
            }, this, 1, 0, delay, false);
        },

        nextPage: function(){
            let currentIndex = this.pageView.getCurrentPageIndex();
            if(currentIndex == 4){
                this.pageView.scrollToPage(0,0.25);
            }else
                this.pageView.setCurrentPageIndex(currentIndex+1);
        },

        backPage: function(){
            let currentIndex = this.pageView.getCurrentPageIndex();
            if(currentIndex == 0){
                this.pageView.scrollToPage(4,0.25);
            }else
                this.pageView.setCurrentPageIndex(currentIndex-1);
        }
    });
}).call(this);
