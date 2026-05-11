/**
 * Created by devnoname007 30/11/2023.
 */

var netConfig = require('NetConfig');
(function () {
  cc.XXRoomView = cc.Class({
    "extends": cc.Component,
    properties: {
      nodeMain: cc.Node,
      nodeRoom: cc.Node,
      nodeHellpView: cc.Node,
      lbNickName: cc.Label,
      //	lbID: cc.Label,
      avatar: cc.Avatar,
      lbiBalance: cc.LabelIncrement,
      //     nodeLoading: cc.Node,
      isShowRoom: true,
      //    isShowLoading: false,
      //     progressLoading: cc.ProgressBar,
    },

    onLoad: function () {
      cc.PopupController.getInstance().showBusy();
      this.animation = this.node.getComponent(cc.Animation);

      var loginResponse = cc.LoginController.getInstance().getLoginResponse();

      cc.RoomController.getInstance().setRoomView(this);
      this.hubName = '';

      //bien check active button room chua
      //     this.isActiveButtonRoom = false;
      this.nodeMain.active = true;
      this.nodeRoom.active = false;
      //	this.nodeRoom1.active = false;
      this.nodeHellpView.active = false;

      //Lay gameId (set khi click vao big game)
      this.gameId = cc.RoomController.getInstance().getGameId();
      this.lbNickName.string = loginResponse.AccountName;
      //this.lbID.string = 'ID: '+loginResponse.AccountID;
      this.lbiBalance.tweenValueto(loginResponse.Balance);
      this.avatar.setAvatar(cc.AccountController.getInstance().getAvatarImage(loginResponse.AvatarID));
    },

    onEnable: function () {
      cc.PopupController.getInstance().hideBusy();

      if (this.isShowRoom) {
        this.nodeMain.active = true;
        this.nodeRoom.active = false;

      }
      // if (this.isShowLoading) {
      //     this.activeLoading();
      // }
    },

    createHdView: function () {
      this.nodeHellpView.active = true;

    },
    closeHdView: function () {
      this.nodeHellpView.active = false;

    },

    //     activeLoading: function() {
    //         this.nodeLoading.active = true;
    //         this.progressLoading.progress = 0;
    //
    //         var self = this;
    //         cc.tween(this.progressLoading)
    //             .to(3, {progress: 1})
    //             .call(() => {
    //                 if (self.isActiveButtonRoom) {
    //                     self.nodeLoading.active = false;
    //                     self.roomClicked(null, 2);
    //                 }
    //             })
    //             .start();
    //     },
    refreshAvatar: function () {
      var loginResponse = cc.LoginController.getInstance().getLoginResponse();
      this.avatar.setAvatar(cc.AccountController.getInstance().getAvatarImage(loginResponse.AvatarID));
    },
    avatarClicked: function () {
      cc.LobbyController.getInstance().createAccountView(cc.AccountTab.PROFILE);
      cc.DDNA.getInstance().uiInteraction(cc.DDNAUILocation.PORTAL, 'ACCOUNT_INFO', cc.DDNAUIType.BUTTON);
    },

    profileClicked: function () {
      cc.LobbyController.getInstance().createAccountView(cc.AccountTab.PROFILE);
      cc.DDNA.getInstance().uiInteraction(cc.DDNAUILocation.PORTAL, 'ACCOUNT_INFO', cc.DDNAUIType.BUTTON);
    },
    profileXacThuc: function () {
      cc.LobbyController.getInstance().createAccountView(cc.AccountTab.REG_PHONE);
      cc.DDNA.getInstance().uiInteraction(cc.DDNAUILocation.PORTAL, 'ACCOUNT_INFO', cc.DDNAUIType.BUTTON);
    },
    
    topupClicked: function () {
      if (cc.LoginController.getInstance().checkLogin()) {
        if (!cc.Config.getInstance().getDomainVK().includes(netConfig.HOST)) {
          switch (cc.ShopController.getInstance().getChargeDefault()) { //cc.ShopController.getInstance().getChargeDefault()
            case 'CARD':
              cc.LobbyController.getInstance().createShopView(cc.ShopTab.TOPUP);
              break;
            case 'BANK':
              cc.LobbyController.getInstance().createShopView(cc.ShopTab.BANK);
              break;
            case 'MOMO':
              cc.LobbyController.getInstance().createShopView(cc.ShopTab.MOMO);
              break;
            default:
              cc.LobbyController.getInstance().createShopView(cc.ShopTab.TOPUP);
          }
        } else {
          cc.LobbyController.getInstance().createShopView(cc.ShopTab.AGENCY);
          cc.DDNA.getInstance().uiInteraction(cc.DDNAUILocation.PORTAL, 'AGENCY', cc.DDNAUIType.BUTTON);
        }

        cc.DDNA.getInstance().shopEntered(cc.DDNAShopName.TOPUP);
        cc.DDNA.getInstance().uiInteraction(cc.DDNAUILocation.PORTAL, 'SHOP_PURCHASE', cc.DDNAUIType.BUTTON);
      }
    },


    activeRoom: function () {
      this.nodeMain.active = false;
      this.nodeRoom.active = true;
      //	this.nodeRoom1.active = false;
    },
    //    activeRoom1: function () {
    //        this.nodeMain.active = false;
    //        this.nodeRoom.active = false;
    //		this.nodeRoom1.active = true;
    //    },		
    activeRoom100: function () {
      if (cc.BalanceController.getInstance().getBalance() < 1000) {
        cc.PopupController.getInstance().showMessage(
          "Số dư không đủ để vào bàn.Vui lòng nạp thêm tiền!"
        );
        return;
      } else {
        this.nodeMain.active = false;
        this.nodeRoom.active = true;
      }
    },
    activeRoom1k: function () {
      if (cc.BalanceController.getInstance().getBalance() < 10000) {
        cc.PopupController.getInstance().showMessage(
          "Số dư không đủ để vào bàn.Vui lòng nạp thêm tiền!"
        );
        return;
      } else {
        this.nodeMain.active = false;
        this.nodeRoom.active = true;
      }
    },
    activeRoom5k: function () {
      if (cc.BalanceController.getInstance().getBalance() < 50000) {
        cc.PopupController.getInstance().showMessage(
          "Số dư không đủ để vào bàn.Vui lòng nạp thêm tiền!"
        );
        return;
      } else {
        this.nodeMain.active = false;
        this.nodeRoom.active = true;
      }
    },
    activeRoom10k: function () {
      if (cc.BalanceController.getInstance().getBalance() < 100000) {
        cc.PopupController.getInstance().showMessage(
          "Số dư không đủ để vào bàn.Vui lòng nạp thêm tiền!"
        );
        return;
      } else {
        this.nodeMain.active = false;
        this.nodeRoom.active = true;
      }
    },
    activeRoom20k: function () {
      if (cc.BalanceController.getInstance().getBalance() < 200000) {
        cc.PopupController.getInstance().showMessage(
          "Số dư không đủ để vào bàn.Vui lòng nạp thêm tiền!"
        );
        return;
      } else {
        this.nodeMain.active = false;
        this.nodeRoom.active = true;
      }
    },
    activeRoom50k: function () {
      if (cc.BalanceController.getInstance().getBalance() < 500000) {
        cc.PopupController.getInstance().showMessage(
          "Số dư không đủ để vào bàn.Vui lòng nạp thêm tiền!"
        );
        return;
      } else {
        this.nodeMain.active = false;
        this.nodeRoom.active = true;
      }
    },
    activeRoom100k: function () {
      if (cc.BalanceController.getInstance().getBalance() < 1000000) {
        cc.PopupController.getInstance().showMessage(
          "Số dư không đủ để vào bàn.Vui lòng nạp thêm tiền!"
        );
        return;
      } else {
        this.nodeMain.active = false;
        this.nodeRoom.active = true;
      }
    },
    activeRoom200k: function () {
      if (cc.BalanceController.getInstance().getBalance() < 2000000) {
        cc.PopupController.getInstance().showMessage(
          "Số dư không đủ để vào bàn.Vui lòng nạp thêm tiền!"
        );
        return;
      } else {
        this.nodeMain.active = false;
        this.nodeRoom.active = true;
      }
    },
    activeRoom500k: function () {
      if (cc.BalanceController.getInstance().getBalance() < 5000000) {
        cc.PopupController.getInstance().showMessage(
          "Số dư không đủ để vào bàn.Vui lòng nạp thêm tiền!"
        );
        return;
      } else {
        this.nodeMain.active = false;
        this.nodeRoom.active = true;
      }
    },
    activeRoom1M: function () {
      if (cc.BalanceController.getInstance().getBalance() < 10000000) {
        cc.PopupController.getInstance().showMessage(
          "Số dư không đủ để vào bàn.Vui lòng nạp thêm tiền!"
        );
        return;
      } else {
        this.nodeMain.active = false;
        this.nodeRoom.active = true;
      }
    },
    activeRoom500: function () {
      if (cc.BalanceController.getInstance().getBalance() < 50000) {
        cc.PopupController.getInstance().showMessage(
          "Số dư không đủ để vào bàn.Vui lòng nạp thêm tiền!"
        );
        return;
      } else {
        this.nodeMain.active = false;
        this.nodeRoom.active = true;
      }
    },
    backmain: function () {
      this.nodeMain.active = true;
      this.nodeRoom.active = false;
    },

    activeMain: function () {
      this.nodeMain.active = true;
      this.nodeRoom.active = false;
      if (this.isShowLoading) {
        this.nodeLoading.active = false;
      }

    },
    backClicked: function () {
      cc.LobbyController.getInstance().destroyDynamicView(null);
      cc.LobbyController.getInstance().offuserguest(true);
    },
    topclick: function () {
      if (cc.LoginController.getInstance().checkLogin()) {
        cc.LobbyController.getInstance().createTopView(cc.ShopTab.XOCDIA);
        //     cc.Tool.getInstance().setItem('@helpTab', cc.ShopTab.LONUOCTHAN);

      }
    },
    hdclick: function () {
      if (cc.LoginController.getInstance().checkLogin()) {
        cc.LobbyController.getInstance().createHdView(cc.ShopTab.XOCDIA);
        //     cc.Tool.getInstance().setItem('@helpTab', cc.ShopTab.LONUOCTHAN);

      }
    },
  });
}).call(this);
