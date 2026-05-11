/**
 * Created by Nofear on 6/7/2017.
 */

(function () {
    cc.TaiXiuSicboMainView = cc.Class({
        "extends": cc.PopupViewBase,
        properties: {
            prefabGraph: cc.Prefab, //soi cau
			prefabJackpotHistory: cc.Prefab,
			prefabRule: cc.Prefab,
            prefabLoading: cc.Prefab,
			prefabSettingView: cc.Prefab,
			prefabChatView: cc.Prefab,
            prefabGroupUser: cc.Prefab
        },

        onLoad: function () {
            cc.TaiXiuSicboMainController.getInstance().setTaiXiuSicboMainView(this);
        },

        createGraphView: function () {
            this.nodeGraphView = this.createView(this.prefabGraph);
        },

        destroyGraphView: function () {
            if (this.nodeGraphView)
                this.nodeGraphView.destroy();
        },
        createJackpotHistoryView: function () {
            this.jackpotHistoryView = this.createView(this.prefabJackpotHistory);
        },
        destroyJackpotHistoryView: function () {
            if (this.jackpotHistoryView)
                this.jackpotHistoryView.destroy();
        },
		
        createRuleView: function () {
            this.ruleView = this.createView(this.prefabRule);
        },
        destroyRuleView: function () {
            if (this.ruleView)
                this.ruleView.destroy();
        },
        createLoadingView: function () {
            this.loadingView = this.createView(this.prefabLoading);
        },
        destroyLoadingView: function () {
            if (this.loadingView)
                this.loadingView.destroy();
        },
        createGroupUserView: function () {
            this.groupUser = this.createView(this.prefabGroupUser);
        },
        destroyGroupUserView: function () {
            if (this.groupUser)
                this.groupUser.destroy();
        },
        createSicboSettingView: function () {
            this.SicboSettingView = this.createView(this.prefabSettingView);
        },
        destroySicboSettingView: function () {
            if (this.SicboSettingView)
                this.SicboSettingView.destroy();
        },
        createSicboChatView: function () {
            this.SicboChatView = this.createView(this.prefabChatView);
        },
        destroySicboChatView: function () {
            if (this.SicboChatView)
                this.SicboChatView.destroy();
        }		
    });
}).call(this);
