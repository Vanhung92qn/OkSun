cc.Class({
    extends: cc.Component,

    properties: {
        nodeChat:cc.Node,
        nodeHieuUng:cc.Node,
        nodeSound:cc.Node,
        nodeBtnChat:cc.Node
    },

    onLoad: function () {
        this.animation = this.node.getComponent(cc.Animation);
        this.displayChat = false;
        this.hieuung = false;
        this.sound = cc.Tool.getInstance().getItem("@Sound").toString() === 'true';
    },

    menuOpenClicked: function() {
        this.animation.play('openMenu');
    },

    menuCloseClicked: function() {
        this.animation.play('closeMenu');
    },
    clickCheckChat(){
        this.displayChat = !this.displayChat;
        this.nodeChat.getChildByName('off').active = this.displayChat;
        this.nodeChat.getChildByName('on').active = !this.displayChat;
        //hide node Chat
        this.nodeBtnChat.active = this.displayChat;
    },
    clickCheckHieuUng(){
        this.hieuung = !this.hieuung;
        this.nodeHieuUng.getChildByName('off').active = this.hieuung;
        this.nodeHieuUng.getChildByName('on').active = !this.hieuung;

    },
    clickCheckSound(){
        this.sound = !this.sound;
        cc.Tool.getInstance().setItem("@Sound", this.sound);
        this.nodeSound.getChildByName('off').active = this.sound;
        this.nodeSound.getChildByName('on').active = !this.sound;
    },
});