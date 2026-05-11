/**
 * Created by Kidman on 05/09/2023.
 */

(function () {
    cc.MissionView = cc.Class({
        "extends": cc.Component,
        properties: {
            missionTemp: cc.Node,
            missionParent: cc.Node,
            iconGuide: cc.Node,
            iconHopqua: cc.Node,

            lbInfo: cc.Label,

            tabs: cc.ToggleContainer,
            countMission: [cc.Label],

            lblTitle: cc.Label,
            lblDesc: cc.Label,
            countToday: cc.Label,
            countCommon: cc.Label,
            nodebtnnaprut: cc.Button,
            nodebtndatcuoc: cc.Button,
            nodetabnaprut: cc.Node,
            nodetabdatcuoc: cc.Node,
            nodelayoutnaprut: [cc.Button],
            nodecontentnaprut: [cc.Node],

            nodelayoutdatcuoc: [cc.Button],
            nodecontentdatcuoc: [cc.Node],
        },

        onLoad: function () {
            // this.tabSelectedIdx = 0;
            //  //this.onTabChanged();
            // for (let i = 0; i < this.tabs.toggleItems.length; i++) {
            //     this.tabs.toggleItems[i].node.on("toggle", () => {
            //         this.tabSelectedIdx = i;
            //         this.onTabChanged();
            //     });
            // }
            // cc.MissionController.getInstance().setMissionView(this);
             this.node.zIndex =  cc.NoteDepth.POPUP_PORTAL;
            // this.getMission(0);
			this.animation = this.node.getComponent(cc.Animation);

        },
		onEnable: function () {
          this.animation.play('openPopup');
        },

        getMission: function (index) {
            this.index = index;
            // var children = this.missionParent.children;
            // for (var i = children.length - 1; i >= 0; i--) {
            //     this.missionParent.removeChild(children[i]);
            // }
            this.missionItems = [];
            var usergetTotalBetIndayCommand = new cc.UsergetTotalBetIndayCommand;
            usergetTotalBetIndayCommand.execute(this);

            // switch (Number.parseInt(index)) {
            //     case 0:
            //         this.inboxSetContent(index==0? 'Hộp thư cá nhân rỗng!' : '', '');
            //         break;
            //     case 1:
            //         var userMissionCommand = new cc.UserMissionCommand;
            //         userMissionCommand.execute(this);
            //         break;
            // }
            
        },

        missionUnselect: function() {
            var children = this.missionParent.children;
            for (var i = children.length - 1; i >= 0; i--) {
                children[i].getComponent('MissionItem').closeClicked();
            }
        },

        missionSetContent: function(title, desc) {
            this.lblTitle.string = title;
            this.lblDesc.string = desc;
        },

        onUserMissionResponse: function (response) {
            this.countToday = response.countToday;
            this.countCommon = response.countCommon;
            this.listToday = response.listToday;
            this.listCommon = response.listCommon;
            this.countToday.string = this.countToday + '';
            this.countCommon.string = this.countCommon + '';
            this.onTabChanged();
        },
        onTotalBetInday: function(response){
            this.totalBetInday = response.TotalBet;
            this.isReceiceAwardToday= response.IsReceived;
            var userMissionCommand = new cc.UserMissionCommand;
            userMissionCommand.execute(this);
        },


        onMissionResponseError: function (response) {
            this.lbInfo.string = 'Không có thông báo nào';
        },

        tabSelect: function(data, index) {
            // for (var i = 0; i < this.tabs.length; i++) {
            //     this.tabs[i].active = false;
            // }

            // this.tabs[index].active = true;
            // this.setItem(index);

            this.nodebtnnaprut.node.getChildByName("selected").getComponent(cc.Sprite).node.active = false;
            this.nodebtnnaprut.node.getChildByName("sprbgon").getComponent(cc.Sprite).node.active = false;
            this.nodebtndatcuoc.node.getChildByName("selected").getComponent(cc.Sprite).node.active = false;
            this.nodebtndatcuoc.node.getChildByName("sprbgon").getComponent(cc.Sprite).node.active = false;
            if(index == 'naprut'){
                this.nodetabnaprut.active = true;
                this.nodetabdatcuoc.active = false;
                this.nodebtnnaprut.node.getChildByName("selected").getComponent(cc.Sprite).node.active = true;
                this.nodebtnnaprut.node.getChildByName("sprbgon").getComponent(cc.Sprite).node.active = true;
            }else if(index == 'datcuoc'){
                this.nodetabdatcuoc.active = true;
                this.nodetabnaprut.active = false;
                this.nodebtndatcuoc.node.getChildByName("selected").getComponent(cc.Sprite).node.active = true;
                this.nodebtndatcuoc.node.getChildByName("sprbgon").getComponent(cc.Sprite).node.active = true;
            }

        },
        tabSelectContent: function(data, index) {
            for (var i = 0; i < this.nodelayoutnaprut.length; i++) {
                this.nodelayoutnaprut[i].node.setScale(0.8,0.8);
                this.nodelayoutnaprut[i].node.opacity = 180;
                this.nodecontentnaprut[i].active = false;
            }
            this.nodelayoutnaprut[index].node.setScale(0.9,0.9);
            this.nodelayoutnaprut[index].node.opacity = 255;
            this.nodecontentnaprut[index].active = true;
        },
        tabSelectContentDatCuoc: function(data, index) {
            for (var i = 0; i < this.nodelayoutdatcuoc.length; i++) {
                this.nodelayoutdatcuoc[i].node.setScale(0.8,0.8);
                this.nodelayoutdatcuoc[i].node.opacity = 180;
                this.nodecontentdatcuoc[i].active = false;
            }
            this.nodelayoutdatcuoc[index].node.setScale(0.9,0.9);
            this.nodelayoutdatcuoc[index].node.opacity = 255;
            this.nodecontentdatcuoc[index].active = true;
        },
        setItem: function(index){
            var children = this.missionParent.children;
            for (var i = children.length - 1; i >= 0; i--) {
                this.missionParent.removeChild(children[i]);
            }
            if (index = 0) {
                this.listToday.forEach(item => {
                    var nodeMission = cc.instantiate(this.missionTemp);
                    nodeMission.parent = this.missionParent;
                    var missionItem = nodeMission.getComponent(cc.MissionItem);
                    missionItem.initItem(item, this);
                    this.missionItems.push(missionItem);
                });
            } else {
                this.listCommon.forEach(item => {
                    var nodeMission = cc.instantiate(this.missionTemp);
                    nodeMission.parent = this.missionParent;
                    var missionItem = nodeMission.getComponent(cc.MissionItem);
                    missionItem.initItem(item, this);
                    this.missionItems.push(missionItem);
                });
            }
        },
        onTabChanged:function(){
            var children = this.missionParent.children;
            for (var i = children.length - 1; i >= 0; i--) {
                this.missionParent.removeChild(children[i]);
            }
            if (this.tabSelectedIdx == 0) {
                this.listToday.forEach(item => {
                    var nodeMission = cc.instantiate(this.missionTemp);
                    nodeMission.parent = this.missionParent;
                    var missionItem = nodeMission.getComponent(cc.MissionItem);
                    missionItem.initItem(item, this);
                    this.missionItems.push(missionItem);
                });
            } else {
                this.listCommon.forEach(item => {
                    var nodeMission = cc.instantiate(this.missionTemp);
                    nodeMission.parent = this.missionParent;
                    var missionItem = nodeMission.getComponent(cc.MissionItem);
                    missionItem.initItem(item, this);
                    this.missionItems.push(missionItem);
                });
            }
        },
        topupClicked: function () {
            switch (cc.ShopController.getInstance().getChargeDefault()) {
                case 'TOPUP':
				    
                    cc.LobbyController.getInstance().createShopView(cc.ShopTab.TOPUP);
                    break;
                case 'ONEPAY':
				 
                    cc.LobbyController.getInstance().createShopView(cc.ShopTab.ONEPAY);
                    break;
                case 'MOMO':
                    cc.LobbyController.getInstance().createShopView(cc.ShopTab.MOMO);
                    break;
                default:
                    cc.LobbyController.getInstance().createShopView(cc.ShopTab.TOPUP);
            }
        //    cc.LobbyController.getInstance().destroyX2RewardView();
        },


        tabMissionCount: function(index, amount) {
            this.countMission[index].string = amount + '';
        },
        closeClicked: function () {
            //this.animation.play('closePopup');
            // var self = this;
            // var delay = 0.2;
            // cc.director.getScheduler().schedule(function () {
            //     self.nodeTabEvents.forEach(function (nodeTabEvent) {
            //         nodeTabEvent.active = false;
            //     });
            //     self.animation.stop();
            //     self.closeFinished();
            // }, this, 1, 0, delay, false);
            this.node.destroy();
        },

        closeFinished: function () {
            this.node.destroy();
        },
        helpClick:function(){
            this.iconGuide.active = true;
            this.iconHopqua.active = false;
        },
        closeHelpClick:function(){
            this.iconGuide.active = false;
            this.iconHopqua.active = true;
        },
        closeClicked: function () {
            //this.showRegister(false);
            this.animation.play('closePopup');
            var self = this;
            var delay = 0.12;
            cc.director.getScheduler().schedule(function () {
                self.animation.stop();
                cc.LobbyController.getInstance().destroyMissionView();
            }, this, 1, 0, delay, false);
        }

    });
}).call(this);