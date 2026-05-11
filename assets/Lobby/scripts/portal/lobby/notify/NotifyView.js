/**
 * Created by Nofear on 6/7/2017.
 */
import Tween from "../../../../scripts/shootFish/common/Tween";

(function () {
    cc.NotifyView = cc.Class({
        "extends": cc.Component,
        properties: {
            nodeContent: cc.Node,
            lbSystem: cc.Label,
            notifyItems: [cc.NotifyItem],
        },

        onLoad: function () {
            cc.NotifyController.getInstance().setNotifyView(this);

            this.baseDuration = 10;
            // this.rootX = this.nodeContent.x;
            this.rootDistance = 980;
            // this.rootY = this.nodeContent.y;

            this.maxItem = this.notifyItems.length;

            this.getNotify();
            //this.animationThongBao();


        },


        getNotify: function () {
            if (this.action && !this.action.isDone()) {
                this.nodeContent.stopAction(this.action);
                this.unscheduleAllCallbacks();
            }

            var getNotifyCommand = new cc.GetNotifyCommand;
            getNotifyCommand.execute(this);
        },
        nhiemvuclickvn1102: function () {
            cc.PopupController.getInstance().showMessage('Tính năng đang bảo trì !');
        },

        onGetNotifyResponse: function (response) {
            //console.log(response);
            this.nodeContent.opacity = 255;
            let self = this;
            if (response !== null && response.List.length === 0) {
                cc.director.getScheduler().schedule(this.getNotify, this, this.baseDuration, 0, 0, false);
                return;
            }

            if (response.List[0].GameID === 0) {
                this.lbSystem.node.active = true;
                this.lbSystem.node.opacity = 255;
                this.lbSystem.string = response.List[0].AccountName + ' ';
                let dataList = response.List.slice(1);
                let duration = 3;
                let fadeout = cc.fadeOut(duration);
                const action = cc.sequence(
                    fadeout,
                    cc.callFunc(() => self.showNotiFadeOut(dataList)));
                this.lbSystem.node.runAction(action);

                return;

            }else{
                self.showNotiFadeOut(response.List);
                return;
            }

            var countNotify = response.List.length;

            for (var i = 1; i < countNotify; i++) {
                var user = response.List[i];
                if (user.GameID > 0) {
                    var lastText = i === countNotify - 1 ? '' : ' ';
                    if (this.notifyItems[i - 1] !== undefined) {
                        this.notifyItems[i - 1].setItem(user, lastText);
                    }
                }
            }

            // if (countNotify - 1 > this.maxItem) {
            //     for (var i = countNotify - 1; i > this.maxItem; i--) {
            //         this.notifyItems[i - 1].node.active = false;
            //     }
            // }

            //13 > 10
            //i = 13; i > 10
            //i = 13,12,11
            if (this.maxItem > (countNotify - 1)) {
                for (var i = this.maxItem; i > 0; i--) {
                    if (i > (countNotify - 1)) {
                        this.notifyItems[i - 1].node.active = false;
                    } else {
                        this.notifyItems[i - 1].node.active = false;
                    }
                }
            }

            let delay = 2.5;
            let duration = 2.5;
            // let action = cc.fadeOut(delay * index, duration);
            for (let index = 0; index < countNotify; index++) {
                let action = cc.fadeOut(delay * index, duration);
                if (index == 0) {
                    this.lbSystem.node.runAction(action);
                } else {
                    this.notifyItems[index - 1].node.active = true;
                    this.notifyItems[index - 1].node.runAction(action);
                }
            }

            // setTimeout(function() {
            //     // self.nodeContent.x = self.rootX;

            //     var distance = self.rootDistance + self.nodeContent.width;
            //     var duration = (self.baseDuration / self.rootDistance) * distance;
            //     duration =3;
            //     self.action = cc.fadeOut(duration);
            //     const moveAndDisable = cc.sequence(
            //         self.action,
            //         cc.callFunc(() => self.function2()));
            //     self.nodeContent.runAction(moveAndDisable);
            //     cc.director.getScheduler().schedule(self.getNotify, self, duration, 0, 0, false);
            // }, 100);
        },

        showNotiFadeOut: function (list) {
            // cc.log('ga ==> ' + JSON.stringify(list));
            var countNotify = list.length;

            for (var i = 0; i < countNotify; i++) {
                var user = list[i];
                this.notifyItems[i].node.active = false;
                var lastText = i === countNotify ? '' : ' ';
                if (this.notifyItems[i] !== undefined) {
                    this.notifyItems[i].setItem(user, lastText);
                }
            }
            this.actionFade(0, list);

        },

        actionFade: function (i, list) {
            if (i >= list.length || i ==3) {
                for (let index = 0; index < list.length; index++) {
                    const element = this.notifyItems[index];
                    element.node.active = false;
                    element.node.opacity = 255;
                }
                this.getNotify();
                return;
            }
            this.notifyItems[i].node.active = true;
            // let delay = 0;
            let duration = 3;
            let self = this;
            self.action = cc.fadeOut(duration);
            const ac = cc.sequence(
                self.action,
                cc.callFunc(() => self.actionFade(i + 1, list)));
            self.notifyItems[i].node.runAction(ac);
        }
    });
}).call(this);
