

cc.Class({
    extends: cc.Component,

    properties: {
		
		nhacoff: cc.Node,
		nhacon: cc.Node,
		hieuUngon: cc.Node,
		hieuUngoff: cc.Node,
		loiMoion: cc.Node,
		loiMoioff: cc.Node,	

		

    },
     onLoad: function () {
            this.animation = this.node.getComponent(cc.Animation);
			this.node.zIndex =  cc.NoteDepth.POPUP_PORTAL;
        },
	onEnable: function () {
          this.animation.play('openPopup');
        },
	clickAudioBg: function() {
            cc.LobbyController.getInstance().setIsOnAudioBg();
        },	
	clicknhacon: function(){
		this.nhacon.active = true;
		this.nhacoff.active = false;
	},
	clicknhacoff: function(){
		this.nhacon.active = false;
		this.nhacoff.active = true;
	},
	hieuungon: function(){
		this.hieuUngon.active = true;
		this.hieuUngoff.active = false;
	},
	hieuungoff: function(){
		this.hieuUngon.active = false;
		this.hieuUngoff.active = true;
	},
	clickmoion: function(){
		this.loiMoion.active = true;
		this.loiMoioff.active = false;
	},
	clickmoioff: function(){
		this.loiMoion.active = false;
		this.loiMoioff.active = true;
	},	
    start () {

    },

    closeClicked: function () {
            this.animation.play('closePopup');
            var self = this;
            var delay = 0.12;
            cc.director.getScheduler().schedule(function () {
                self.animation.stop();
                cc.LobbyController.getInstance().destroySettingView();
            }, this, 1, 0, delay, false);
        }

    });


