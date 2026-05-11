/**
 * Created by Welcome on 5/28/2019.
 */

(function () {
  cc.XXPlayer = cc.Class({
    extends: cc.Component,
    properties: {
      lbSID: cc.Label,
      lbName: cc.Label,
      lbChipSeft: cc.Label,
      nickName: "",
    },

    onLoad: function () {
      //animation
      this.animation = this.node.getComponent(cc.Animation);
      //node emotion
      var nodeChat = this.node.getChildByName("chat");
      this.nodeEmotion = nodeChat.getChildByName("emotion");
      this.nodeBubble = nodeChat.getChildByName("bubble");
      //skeleton Emotion
      this.skeEmotion = this.nodeEmotion.getComponent(sp.Skeleton);
      //label Chat
      this.lbBubbleChat = this.nodeBubble.getComponentInChildren(cc.Label);
      nodeChat.active = false;

      //avatar cua player
      this.avatar = this.node.getComponentInChildren(cc.Avatar);
      //node win/lose cua player
      this.nodeWin = this.node.getChildByName("win");
      //this.nodeLose = this.node.getChildByName('lose');

      this.bgWin = this.node.getChildByName("bgWin");
      //lbWin cua player
      this.lbWin = this.bgWin.getComponentInChildren(cc.Label);
      //anim lbWin cua player
      this.animLbWin = this.node.getComponentInChildren(cc.Animation);

      //node thong tin player (name + chip)
      this.nodeInfo = this.node.getChildByName("ava_money");
      //this.bgWin = this.node.getChildByName('bgWin');
      //lbChip cua player
      this.lbChip = this.nodeInfo
        .getChildByName("lbChip")
        .getComponent(cc.LabelIncrement);
      this.lbChip.formatCurrencyUnit = true;
      //lbName cua player
      // this.lbName = this.nodeInfo.getChildByName('lbName').getComponent(cc.Label);

      this.nodeInfo.active = false;
      if (!this._reloadInfoInterval) {
        this._reloadInfoInterval = setInterval(() => {
          if (cc.LoginController.getInstance().checkLogin()) {
            let chip = cc.BalanceController.getInstance().getBalance();
            // console.log("updateChip1", chip);
            if (this.lbChipSeft && this.lbChipSeft.string) {
              this.lbChipSeft.string = cc.Tool.getInstance().formatMoney(chip);
            }
          }
        }, 3000);
      }
    },

    //reset lai UI ket qua
    resetPlayerResultUI: function () {
      this.nodeWin.active = false;
      //this.nodeLose.active = false;
      this.lbWin.node.active = false;
      this.bgWin.active = false;
      //this.bgWin.active = false;
    },

    onDestroy: function () {
      if (this._reloadInfoInterval) {
        clearInterval(this._reloadInfoInterval);
        this._reloadInfoInterval = null;
      }
    },

    //set ket qua cho player
    playerResultUI: function (isWin, amount) {
      // this.nodeWin.active = false;
      //this.nodeLose.active = false;

      //set gia tri
      if (isWin) {
        this.nodeWin.active = true;
        cc.tween(this.nodeWin).to(5, { rotation: 360 }).start();
        this.lbWin.string = "" + cc.Tool.getInstance().formatMoney(amount);
        //this.lbWin.font = cc.XXController.getInstance().getWinFont();
      }

      //play fx thang / thua
      this.lbWin.node.active = true;
      this.bgWin.active = true;
      this.animLbWin.play("xxWin");
      //this.bgWin.active = true;
      //this.lbWin.node.scaleY = 0.7;
      //this.lbWin.node.scaleX = 0.7;
      //this.animLbWin.play('xxWin');
    },
    updateChip: function (chip) {
      // console.log("updateChip", chip);
      if (chip < 0) {
        chip = 0;
      }
      this.lbChip.tweenValueto(chip);
    },

    //player vao phong
    registerPlayer: function (accountInfo) {
      var avatarID = accountInfo.Avatar;
      if (avatarID <= 0) {
        avatarID = 1;
      }
      this.nickName = accountInfo.NickName;

      //set avatar
      this.avatar.setAvatar(
        cc.AccountController.getInstance().getAvatarImage(avatarID)
      );

      //set name
      // this.lbName.string = accountInfo.NickName;
      if (accountInfo.ServiceID) {
        this.lbSID.string = ""; // cc.Config.getInstance().getServiceNameNoFormat(accountInfo.ServiceID)
        //set name
        this.lbName.string = cc.Config.getInstance().formatName(
          accountInfo.NickName,
          7
        );
      } else {
        this.lbSID.string = "";
        //set name
        this.lbName.string = cc.Config.getInstance().formatName(
          accountInfo.NickName,
          10
        );
      }

      //set chip
      if (accountInfo.Balance < 0) {
        accountInfo.Balance = 0;
      }
      // console.log("registerPlayer", accountInfo);
      // canhlv
      if (accountInfo.AccountID < 20000) {
        // console.log("AccountID dưới 20000, cộng thêm tiền thử nghiệm");
        // accountInfo.Balance += 50000000;
        accountInfo.Balance += Math.floor(
          Math.random() * (350000000 - 50000000 + 1) + 100000000
        ); // <== bạn ghi 5 triệu, nhưng có thể bạn muốn +50 triệu?
        // console.log("New Balance:", accountInfo.Balance);
      }
      this.lbChip.tweenValueto(accountInfo.Balance);

      //bat node thong tin
      this.nodeInfo.active = true;
    },

    //player roi phong
    unRegisterPlayer: function () {
      //set = avatar def
      this.avatar.setAvatar(
        cc.LobbyController.getInstance().getGameAssets().avatarDef
      );
      //tat node thong tin
      this.nodeInfo.active = false;
    },

    updateConnectionStatus: function (status) {
      switch (status) {
        case cc.ConnectionStatus.DISCONNECTED:
          break;
        case cc.ConnectionStatus.CONNECTED:
          break;
      }
    },

    updatePlayerStatus: function (playerStatus) {
      this.playerStatus = playerStatus.toString();
      if (playerStatus.toString() === cc.PlayerStatus.INGAME) {
        this.node.opacity = 255;
      } else {
        this.node.opacity = 150;
      }
    },

    showEmotion: function (index, message) {
      this.nodeBubble.active = false;
      this.nodeEmotion.active = true;

      this.skeEmotion.clearTracks();
      this.skeEmotion.setToSetupPose();

      //fix loi server cam chat sexy
      if (index === 15) {
        this.skeEmotion.setAnimation(index, "16-extreme-sexy-girl", true);
      } else {
        this.skeEmotion.setAnimation(index, message[1], true);
      }

      this.animation.play("showBubbleChat");
    },

    showBubbleChat: function (message) {
      this.nodeBubble.active = true;
      this.nodeEmotion.active = false;

      this.lbBubbleChat.string = message[1];

      this.animation.play("showBubbleChat");
    },
  });
}).call(this);
