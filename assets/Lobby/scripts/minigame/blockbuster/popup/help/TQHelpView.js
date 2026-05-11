
(function () {
    cc.TQHelpView = cc.Class({
        "extends": cc.PopupBase,
        properties: {
            nodeSpriteHelp: [cc.Node],
        },

        onLoad: function () {
            this.animation = this.node.getComponent(cc.Animation);
            this.node.zIndex = cc.NoteDepth.POPUP_TAIXIU;
        },

        onEnable: function () {
            this.index = 0;
            this.nodeSpriteHelp[this.index].active = true;
        },

        closeFinished: function () {
            cc.TQPopupController.getInstance().destroyHelpView();
        },

        nextPage: function () {
            this.index++;
            if (this.index == 3) this.index = 0;
            this.showHelp();
            // this.nodeSpriteHelp[this.index].active = true;
        },

        prePage: function () {
            this.index--;
            if (this.index == -1) this.index = 2;
            this.showHelp();
            // this.nodeSpriteHelp[this.index].active = true;
        },

        showHelp: function () {
            this.nodeSpriteHelp.forEach(node => {
                node.active = false;
            });
            this.nodeSpriteHelp[this.index].active = true;
        }
    });
}).call(this);
