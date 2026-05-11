
cc.Class({
    extends: cc.Component,

    properties: {
			
    },
     onLoad: function () {
            this.animation = this.node.getComponent(cc.Animation);
			this.node.zIndex =  cc.NoteDepth.POPUP_PORTAL;
        },
	onEnable: function () {
          this.animation.play('openPopup');
        },

    start () {

    },

    closeClicked: function () {
            this.animation.play('closePopup');
            var self = this;
            var delay = 0.12;
            cc.director.getScheduler().schedule(function () {
                self.animation.stop();
                cc.LobbyController.getInstance().destroyLuatchoiView();
            }, this, 1, 0, delay, false);
        }

    });


