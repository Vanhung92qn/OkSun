

cc.Class({
    extends: cc.Component,

    properties: {
       
    },


    onLoad () {
		this.animation = this.node.getComponent(cc.Animation);
	},
	 onEnable: function () {
			 this.animation.play('openPopup');
        },

    start () {

    },
     dangxuatClicked: function () {
           if (this.isCardGame) {
               //thoat game
               cc.LobbyController.getInstance().destroyDynamicView(null);
           } else {
              cc.DDNA.getInstance().uiInteraction(cc.DDNAUILocation.PORTAL, 'BACK', cc.DDNAUIType.BUTTON);
           }
           
        },
});
