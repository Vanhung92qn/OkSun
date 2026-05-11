/**
 * Created by Nofear on 6/7/2017.
 */

(function () {
    cc.XXPopupView = cc.Class({
        "extends": cc.PopupViewBase,
        properties: {
            prefabGroupUser: cc.Prefab,
            prefabSetting: cc.Prefab,
            prefabInviteUser: cc.Prefab,
            // prefabHistory: cc.Prefab,
        },

        onLoad: function () {
            console.log("XXPopupView onLoad");
            cc.XXPopupController.getInstance().setXXPopupView(this);
        },
        createGroupUserView: function () {
            this.nodeGroupUser = this.createView(this.prefabGroupUser);
        },
        createInviteUserView: function () {
            this.nodeInviteUser = this.createView(this.prefabInviteUser);
        },
        createSettingView: function () {
            this.nodeSetting = this.createView(this.prefabSetting);
        },
        destroyGroupUserView: function () {
            if (this.nodeGroupUser)
                this.nodeGroupUser.destroy();
        },
        destroySettingView: function () {
            if (this.nodeSetting)
                this.nodeSetting.destroy();
        },
        destroyInviteUserView: function () {
            if (this.nodeInviteUser)
                this.nodeInviteUser.destroy();
        },
        // updateListDetailJackPot:function(list){
        //     console.log(list);
        //     if (this.nodeHistoryView)
        //     console.log(this.nodeHistoryView);
        //         this.nodeHistoryView.updateListDetail(list);
        // }
        
    });
}).call(this);
