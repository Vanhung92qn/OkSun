/**
 * Created by Nofear on 3/21/2019.
 */

(function () {
    cc.SettingRoomView = cc.Class({
        "extends": cc.Component,
        properties: {
            animation: cc.Animation,
         //   nodeOffset: cc.Node,

            spriteSound: cc.Sprite,
            spriteMusic: cc.Sprite,

            sfSounds: [cc.SpriteFrame], //0=on, 1=off
            sfMusics: [cc.SpriteFrame], //0=on, 1=off

            isShowTick: false,
        },

        onLoad: function () {
           // this.nodeOffset.scale = cc.v2(0,0);
        },

        start: function () {
            //Check Sound
            this.sound = cc.Tool.getInstance().getItem("@Sound").toString() === 'true';
            this.music = cc.Tool.getInstance().getItem("@Music").toString() === 'true';

            if (!this.isShowTick) {
                this.spriteSound.spriteFrame = this.sound ? this.sfSounds[0] : this.sfSounds[1];
                this.spriteMusic.spriteFrame = this.music ? this.sfMusics[0] : this.sfMusics[1];
            }
            else {
                this.spriteSound.node.active = this.sound;
                this.spriteMusic.node.active = this.music;
            }

            cc.AudioController.getInstance().enableSound(this.sound);
            cc.AudioController.getInstance().enableMusic(this.music);
        },

        openSettingClicked: function () {
            this.animation.play('openSettingMenu');
        },

        closeSettingClicked: function () {
            this.animation.play('closeSettingMenu');
        },

        soundClicked: function () {
            this.sound = !this.sound;
            cc.Tool.getInstance().setItem("@Sound", this.sound);
            if (!this.isShowTick)
                this.spriteSound.spriteFrame = this.sound ? this.sfSounds[0] : this.sfSounds[1];
            else
                this.spriteSound.node.active = this.sound;

            cc.AudioController.getInstance().enableSound(this.sound);
        },

        musicClicked: function () {
            this.music = !this.music;
            cc.Tool.getInstance().setItem("@Music", this.music);
            if (!this.isShowTick)
                this.spriteMusic.spriteFrame = this.music ? this.sfMusics[0] : this.sfMusics[1];
            else
                this.spriteMusic.node.active = this.music;

            cc.AudioController.getInstance().enableMusic(this.music);
        },

    });
}).call(this);
