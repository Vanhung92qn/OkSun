/**
 * Created by Nofear on 6/7/2017.
 */

(function () {
    cc.SonTinhSpinButtonView = cc.Class({
        "extends": cc.Component,
        properties: {
            btnBack: cc.Button,
            btnSelectBetLines: cc.Button,
            btnX2: cc.Button,
            btnSpin: cc.Button,
			btnAutoSpin: cc.Button,
			skeSpin: sp.Skeleton,
			skeAutoSpin: sp.Skeleton,

            spriteSelectBetLines: cc.Sprite,
            spriteSpin: cc.Sprite,
            spriteAutoSpin: cc.Sprite,
            spriteFastSpin: cc.Sprite,
            spriteX2: cc.Sprite,

            sfSpins: [cc.SpriteFrame],
            sfAutoSpins: [cc.SpriteFrame],//0 = normal
            sfFastSpins: [cc.SpriteFrame],
            sfX2s: [cc.SpriteFrame],
            sfSelectBetLines: [cc.SpriteFrame],

        },

        onLoad: function () {
            cc.SpinController.getInstance().setButtonView(this);
            if (this.btnX2) {
                this.btnX2.interactable = false;
                this.spriteX2.spriteFrame = this.sfX2s[1];
            }
			this.isSpin = false;
            this.isAutoSpin = false;
        },

        activeButtonSelectBetLines: function (enable) {
            this.btnSelectBetLines.interactable = enable;
        },

        activeButtonSpin: function (enable) {
            //this.btnBack.interactable = enable;
			this.isSpin = enable;
            if (this.btnSelectBetLines !== undefined) {
                this.btnSelectBetLines.interactable = enable;
                if (!enable && this.btnX2) {
                    this.btnX2.interactable = enable;
                    this.spriteX2.spriteFrame = this.sfX2s[1];
                }
				if (this.isSpin = enable) {
					this.btnAutoSpin.node.active = false;
					this.btnSpin.node.active = true;
					this.skeSpin.setAnimation(0, 'Idle', true);
				} else {
					this.btnAutoSpin.node.active = true;
					this.btnSpin.node.active = false;
				}
				
                if (this.spriteSelectBetLines !== null && this.spriteSelectBetLines !== undefined)
                    this.spriteSelectBetLines.spriteFrame = enable ? this.sfSelectBetLines[0] : this.sfSelectBetLines[1];   
            }
        },

        activeButtonX2: function (enable) {
            if (this.btnX2) {
                if (enable) {
                    if (!this.isAutoSpin) {
                        this.btnX2.interactable = enable;
						this.skeSpin.setAnimation(0, 'Disable', true);
                        this.spriteX2.spriteFrame = enable ? this.sfX2s[0] : this.sfX2s[1];
                    }
                } else {
                    this.btnX2.interactable = enable;
					this.skeSpin.setAnimation(0, 'Spin', true);
                    this.spriteX2.spriteFrame = enable ? this.sfX2s[0] : this.sfX2s[1];
                }
            }
        },

        activeButtonAutoSpin: function (enable) {
            this.isAutoSpin = enable;
			if (this.isAutoSpin = enable) {
				this.btnAutoSpin.node.active = true;
				this.btnSpin.node.active = false;
				this.skeAutoSpin.setAnimation(0, 'Stop', true);			
			} else {
				this.btnAutoSpin.node.active = false;
				this.btnSpin.node.active = true;
				this.skeAutoSpin.setAnimation(0, 'Idle', true);				
			}
        },

        activeButtonFastSpin: function (enable) {
            this.spriteFastSpin.spriteFrame = enable ? this.sfFastSpins[1] : this.sfFastSpins[0];
        }
    });
}).call(this);
