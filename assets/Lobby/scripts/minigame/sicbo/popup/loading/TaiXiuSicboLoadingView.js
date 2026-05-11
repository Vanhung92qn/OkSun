(function () {
    cc.TaiXiuSicboLoadingView = cc.Class({
        "extends": cc.PopupBase,
        properties: {
            progress: cc.Node
        },

        onLoad: function () {
            this.animation = this.node.getComponent(cc.Animation);
            this.node.zIndex = cc.NoteDepth.POPUP_TAIXIU_SICBO + 1;
            var self = this;
            cc.tween(self.progress)
                            .repeatForever(
                                cc.tween().sequence(
                                    cc.tween().to(0.3, { angle: 0 }, { easing: cc.easing.sineOut }),
                                    cc.tween().to(0.3, { angle: -90 }, { easing: cc.easing.sineOut }),
                                    cc.tween().to(0.3, { angle: -180 }, { easing: cc.easing.sineOut }),
                                    cc.tween().to(0.3, { angle: -270 }, { easing: cc.easing.sineOut }),
                                    cc.tween().to(0.3, { angle: -360 }, { easing: cc.easing.sineOut })))
                            .start();
        },

    });
}).call(this);