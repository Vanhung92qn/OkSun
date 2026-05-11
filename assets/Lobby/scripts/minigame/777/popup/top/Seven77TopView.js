/**
 * Created by Nofear on 3/14/2019.
 */


(function () {
    cc.Seven77TopView = cc.Class({
        "extends": cc.Component,
        properties: {

   //         nodeJackpot: cc.Node,
            seven77JackpotView: cc.Seven77TopJackpotView,
        },

        onLoad: function () {
            //this.animation = this.node.getComponent(cc.Animation);
			this.node.zIndex = cc.NoteDepth.POPUP_TAIXIU;
        },

        onEnable: function () {
   //         this.nodeJackpot.active = true;

        },

        backClicked: function () {
            this.seven77JackpotView.seven77JackpotListView.resetList();
           // this.animation.play('closePopup');
            var self = this;
            var delay = 0.12;
            cc.director.getScheduler().schedule(function () {
                //self.animation.stop();
                self.node.destroy();
            }, this, 1, 0, delay, false);
        },
    });
}).call(this);
