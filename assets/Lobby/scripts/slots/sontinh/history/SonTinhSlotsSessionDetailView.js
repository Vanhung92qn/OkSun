/**
 * Created by Nofear on 3/15/2019.
 */


(function () {
    cc.SonTinhSlotsSessionDetailView = cc.Class({
        "extends": cc.SlotsSessionDetailViewBase,
        properties: {
            skeletonIcons: [sp.Skeleton],
            spriteIcons: [cc.Node]
        },

        showDetail: function() {
            var self = this;
            var i = 0;
            var data = cc.SlotsHistoryController.getInstance().getSessionDetailData();

            var list = cc.Tool.getInstance().convertStringArrayToIntArray(data.SlotsData);

            var skeletonDataIcons = cc.SpinController.getInstance().getIconView().skeletonDataIcons;
            var spriteDataIcons = cc.SpinController.getInstance().getIconView().spriteDataIcons;

            list.forEach(function (index) {
                if (skeletonDataIcons[index - 1] != null) {
                    self.skeletonIcons[i].skeletonData = skeletonDataIcons[index - 1];
                    self.spriteIcons[i].active = false;
                }
                else{
                    self.spriteIcons[i].addComponent(cc.Sprite).spriteFrame = spriteDataIcons[index - 1];
                    self.skeletonIcons[i].node.active = false;
                }
                
                i++;
            });

            this.lbSessionID.string = '#' + data.SpinID;
            this.lbTotalBet.string = cc.Tool.getInstance().formatNumber(data.TotalBetValue);
            this.lbTotalWin.string = cc.Tool.getInstance().formatNumber(data.TotalPrizeValue);

            // this.spriteBGRoom.spriteFrame = this.sfBGRooms[data.RoomID - 1];
        },
    });
}).call(this);
