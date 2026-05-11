/**
 * Created by Welcome on 5/28/2019.
 */

(function () {
  cc.XXInfoView = cc.Class({
    extends: cc.Component,
    properties: {
      //phien
      lbSID: cc.Label,
      //thoi gian
      lbTimer: cc.Label,

      //giai doan (đặt cửa, kết quả...)
      lbInfo: cc.Label,
      animationTimeBet: sp.Skeleton,
      labelProgress: cc.Label,
      progressTimer: cc.ProgressBar,
      //total user
      lbTotalUser: cc.Label,
      lbTotalUserWin: cc.Label,
      //players
      xxPlayers: [cc.XXPlayer],
      //nodeBorderMiniGame:cc.Node,
      nodeBgMiniGame: sp.Skeleton,
      nodeMiniGame: cc.Node,
      labelStopBet: cc.Label,
      labelOpenBet: cc.Label,
      spinColumnViews: [cc.XXSpinColumView],
      bgche: cc.Node,
    },

    onLoad: function () {
      var self = this;
      this.interval = null;
      this.timeBet = 54;
      this.reset();
      // console.log("onLoad XXInfoView 2");
      cc.XXController.getInstance().setXXInfoView(this);

      this.maxPlayer = this.xxPlayers.length;

      this.animInfo = this.lbInfo.node.parent.getComponent(cc.Animation);

      this.currPlayer = this.xxPlayers[0];
      this.timeouts = [];
    },

    onEnable: function () {
      this.MainActive = 0;
    },

    setMain: function (active) {
      // console.log("setMain", active);
      this.MainActive = active;
    },

    onDestroy: function () {
      this.timeouts.forEach(function (t) {
        clearTimeout(t);
      });
      this.timeouts = [];
    },
    //Cap nhat thong tin nguoi choi hien tai
    updateInfoCurrPlayer: function (data) {
      this.currPlayer.registerPlayer(data);
    },
    //HubOn - joinGame
    joinGame: function (info) {
      //lay ve mang vi tri player
      this.positions = info.Positions;

      this.countPlayer = 0;
      //luu vi tri player tren UI
      this.positionsUI = [0, 0, 0, 0, 0, 0, 0, 0, 0];

      //tim index của owner
      this.onwerIndex = 0;

      //gan vi tri Owner
      this.positionsUI[this.countPlayer] =
        cc.LoginController.getInstance().getUserId();

      this.countPlayer++;
      for (var i = 0; i < this.maxPlayer; i++) {
        var accID = this.positions[i];
        //add vi tri cac accID khac vao position tren UI
        if (
          accID > 0 &&
          accID !== cc.LoginController.getInstance().getUserId()
        ) {
          this.positionsUI[this.countPlayer] = accID;
          this.countPlayer++;
        }
      }

      //lay ve players
      var players = info.Players;

      for (var i = 0; i < this.maxPlayer; i++) {
        var accID = this.positions[i];
        //cac vi tri co nguoi choi: accID > 0
        if (accID > 0) {
          this.registerPlayer(
            this.getIndexUIBetByAccID(accID),
            players[accID].Account
          );
        }
      }
      cc.XXController.getInstance().updatePositionPlayerUI(this.positionsUI);
    },

    //HubOn - playerJoin
    playerJoin: function (info) {
      for (var i = 0; i < this.maxPlayer; i++) {
        var accID = this.positionsUI[i];
        if (accID === 0) {
          this.positionsUI[i] = info.Account.AccountID;
          this.registerPlayer(i, info.Account);
          break;
        }
      }
    },

    //HubOn - playerLeave
    playerLeave: function (info) {
      //dam bao joinGame xong moi xu ly - tranh loi server neu bi
      if (this.positionsUI) {
        var accID = info[0];

        this.unRegisterPlayer(this.getIndexUIBetByAccID(accID));

        var index = -1;
        for (var i = 0; i < this.maxPlayer; i++) {
          if (accID === this.positionsUI[i]) {
            index = i;
            break;
          }
        }

        this.positionsUI[index] = 0;
      }
    },

    //HubOn - updateConnectionStatus
    updateConnectionStatus: function (info) {
      if (this.positionsUI) {
        var accID = info[0];
        var status = info[1];
        this.xxPlayers[this.getIndexUIBetByAccID(accID)].updateConnectionStatus(
          status
        );

        //neu la owner dky rời game -> tắt game
        if (
          status === cc.XXConnectionStatus.REGISTER_LEAVE_GAME &&
          accID === cc.LoginController.getInstance().getUserId()
        ) {
          cc.LobbyController.getInstance().destroyDynamicView(null);
        }
      }
    },

    //HubOn - updatePlayerStatus
    updatePlayerStatus: function (playerStatus) {
      if (this.positionsUI) {
        this.xxPlayers[0].updatePlayerStatus(playerStatus);
      }
    },
    //HubOn - summaryPlayer
    summaryPlayer: function (totalUser) {
      // Đồng bộ bằng thời gian
      // console.log("summaryPlayer", totalUser);
      // console.log("MainActive", this.MainActive);
      const now = Date.now();
      const t = Math.floor(now / 1000); // giây hiện tại
      const offset = [0, 100, 200, 300]; // lệch pha cho từng room
      // canhlv
      const numbers = offset.map((o) => {
        const val = Math.sin((t + o) * 0.5) * 50 + 1000;
        return Math.floor(val);
      });

      // this.lbUserRoom1.string = numbers[0] + 100; // giả sử room 1 có 100 người
      // this.lbUserRoom2.string = numbers[1] + 30;
      // this.lbUserRoom3.string = numbers[2] - 50;
      // this.lbUserRoom4.string = numbers[3] - 100;
      if (this.MainActive == 1) {
        this.lbTotalUser.string = numbers[0] + 100;
      } else if (this.MainActive == 2) {
        this.lbTotalUser.string = numbers[1] - 920;
      } else if (this.MainActive == 3) {
        this.lbTotalUser.string = numbers[2] - 920;
      } else if (this.MainActive == 4) {
        this.lbTotalUser.string = numbers[3] - 920;
      }
    },

    //HubOn - vipPlayer
    vipPlayer: function (dataPlayers) {
      let countPlayer = 0;
      this.positionsUI = [0, 0, 0, 0, 0, 0, 0];
      this.positionsUI[0] = cc.LoginController.getInstance().getUserId();
      countPlayer++;
      dataPlayers.map((player) => {
        if (player.AccountID != cc.LoginController.getInstance().getUserId()) {
          if (countPlayer <= 8) {
            this.positionsUI[countPlayer] = player.AccountID;
            countPlayer++;
          }
        }
      }, this);
      //Hien thi player
      this.positionsUI.forEach(function (accID, index) {
        var slot = this.xxPlayers && this.xxPlayers[index];
        if (!slot) return;
        if (accID != 0) {
          try {
            let playerInfo = dataPlayers.filter(
              (player) => player.AccountID == accID
            );
            if (playerInfo.length > 0 && index != 0) {
              if (slot.registerPlayer) slot.registerPlayer(playerInfo[0].Account);
              if (slot.resetPlayerResultUI) slot.resetPlayerResultUI();
            }
          } catch (e) { }
        } else {
          if (slot.unRegisterPlayer) slot.unRegisterPlayer();
        }
      }, this);
      cc.XXController.getInstance().updatePositionPlayerUI(this.positionsUI);
    },
    //HubOn - totalUserWin
    totalUserWin: function (amount) {
      //set gia tri
      // this.lbTotalUserWin.string = '+' + cc.Tool.getInstance().formatNumber(amount);
      // this.lbTotalUserWin.font = cc.XXController.getInstance().getWinFont();
      // //play fx thang
      // this.lbTotalUserWin.node.active = true;
      // this.lbTotalUserWin.node.scaleY = 0;
      // this.lbTotalUserWin.node.getComponent(cc.Animation).play('xxWin');
    },
    //HubOn - WinResultVip
    winResultVip: function (dataPlayer) {
      if (!this.positionsUI) return;
      if (dataPlayer.length > 0) {
        dataPlayer.map((player) => {
          let indexPlayer = this.positionsUI.indexOf(player.AccountID);
          if (
            player.AccountID != cc.LoginController.getInstance().getUserId() &&
            indexPlayer != -1
          ) {
            if (player.AccountID < 20000) {
              // console.log("AccountID dưới 20000, cộng thêm tiền thử nghiệm");
              //canhlv test
              // player.Balance += 50000000;
              player.Balance += Math.floor(
                Math.random() * (350000000 - 50000000 + 1) + 100000000
              );
              // console.log("New Balance:", player.Balance);
            }
            this.xxPlayers[indexPlayer].playerResultUI(true, player.Award);
            this.xxPlayers[indexPlayer].updateChip(player.Balance);
          }
        });
      }
    },
    //HubOn - WinResult
    winResult: function (dataPlayer) {
      // console.log("winResult", dataPlayer);
      if (!this.currPlayer) return;
      this.currPlayer.playerResultUI(true, dataPlayer.Award);
      this.currPlayer.updateChip(dataPlayer.Balance);
    },
    updateChip: function (accID, chip) {
      if (!this.positionsUI || !this.xxPlayers) return;
      if (this.positionsUI.indexOf(accID) === -1) return;
      var idx = this.getIndexUIBetByAccID(accID);
      var p = this.xxPlayers[idx];
      if (p && typeof p.updateChip === 'function') p.updateChip(chip);
    },

    getPositions: function () {
      return this.positionsUI;
    },

    //lay ve index bet theo accID
    getIndexUIBetByAccID: function (accID) {
      var indexBet = -1;
      try {
        for (var i = 0; i < this.maxPlayer; i++) {
          if (this.positionsUI[i] === accID) {
            indexBet = i;
            break;
          }
        }
      } catch (err) { }
      // console.log('getIndexUIBetByAccID: ' + indexBet);
      return indexBet;
    },

    //lay ve index bet theo accID
    getIndexUIBetByPosition: function (pos) {
      var indexBet = pos;

      if (indexBet > this.onwerIndex) {
        //map lai theo UI
        indexBet += this.onwerIndex;

        if (indexBet >= this.maxPlayer) {
          indexBet -= this.maxPlayer - 1;
        }
      } else if (indexBet < this.onwerIndex) {
        //map lai theo UI
        indexBet -= this.onwerIndex;
        if (indexBet < 0) {
          indexBet = this.maxPlayer + indexBet;
        }
      } else {
        indexBet = 0;
      }

      // console.log('getIndexUIBetByPosition: ' + indexBet);
      return indexBet;
    },

    //reset UI ket qua (win/lose) sau moi Phien cua tat ca player
    resetPlayersResultUI: function () {
      this.lbTotalUserWin.node.active = false;
      for (var i = 0; i < this.maxPlayer; i++) {
        this.xxPlayers[i].resetPlayerResultUI();
      }
    },

    //set ket qua cua player
    playerResultUI: function (playerIndex, isWin, amount) {
      this.xxPlayers[playerIndex].playerResultUI(isWin, amount);
    },

    //player vao phong
    registerPlayer: function (playerIndex, info) {
      this.xxPlayers[playerIndex].registerPlayer(info);
    },

    unRegisterPlayer: function (playerIndex) {
      this.xxPlayers[playerIndex].unRegisterPlayer();
    },

    playerShowBubbleChat: function (message) {
      if (cc.ChatRoomController.getInstance().checkIsEmotion(message)) {
        // <<<<<<< HEAD
        //                 this.xxPlayers.forEach(function (player) {
        //                     if (player.lbName.string === cc.Config.getInstance().formatName(message[0], 7)
        //                         && player.lbSID.string === cc.Config.getInstance().getServiceNameNoFormat(message[2])) {
        //                         player.showEmotion(cc.ChatRoomController.getInstance().getIndexEmotion(message)
        // =======
        this.xxPlayers.forEach(function (xxPlayer) {
          if (xxPlayer.nickName === message[0]) {
            xxPlayer.showEmotion(
              cc.ChatRoomController.getInstance().getIndexEmotion(message),
              // >>>>>>> remotes/origin/Update-DgTiger-XX
              message
            );
          }
        });
      } else {
        // <<<<<<< HEAD
        //                 this.xxPlayers.forEach(function (player) {
        //                     if (player.lbName.string === cc.Config.getInstance().formatName(message[0], 7)
        //                         && player.lbSID.string === cc.Config.getInstance().getServiceNameNoFormat(message[2])) {
        //                         player.showBubbleChat(message);
        // =======
        this.xxPlayers.forEach(function (xxPlayer) {
          if (xxPlayer.nickName === message[0]) {
            xxPlayer.showBubbleChat(message);
            // >>>>>>> remotes/origin/Update-DgTiger-XX
          }
        });
      }
    },

    reset: function () {
      this.isTimer = false;
      this.timer = 0;
      this.labelProgress.string = "0";
      this.currentState = 999;
      if (this.interval !== null) {
        clearInterval(this.interval);
      }
    },

    startTimer: function (time) {
      console.log("startTimer2: " + time);
      this.reset();
      // this.totalTime = time;          // ví dụ 20 (từ server)
      // this.visualTotalTime = 17;      // bạn muốn 17s
      // this.speed = this.totalTime / this.visualTotalTime; // 20/17

      // this.timer = time;              // đếm theo đơn vị "giây server" còn lại
      // this.timeInt = Math.ceil(this.timer);
      // this.lbTimer.string = this.timeInt;
      // this.isTimer = true;
      // this.progressTimer.progress = 1;

      // this.schedule(this._tickTimer, 0);
    },

    _startBetProgress: function (visualSeconds) {
      if (!this.progressTimer) return;
      console.log("Start Bet Progress: " + visualSeconds);

      // Dừng mọi tween cũ
      cc.Tween.stopAllByTarget(this.progressTimer);
      // cc.Tween.stopAllByTarget(this.labelStopBet.node);
      // cc.Tween.stopAllByTarget(this.labelOpenBet.node);

      // Reset trạng thái ban đầu
      this.progressTimer.node.active = true;
      this.progressTimer.progress = 1;
      cc.tween(this.progressTimer)
        .to(visualSeconds, { progress: 0 }, { easing: 'linear' })
        .call(() => {
          // 1) Ẩn thanh bar
          this.progressTimer.progress = 0;
          // this.progressTimer.node.active = false;
          // this.labelStopBet.node.active = true;
          // 2) Hiện STOP BET → OPEN BET
          // flashBanner(this.labelStopBet.node, 1.5)
          //   .call(() => {
          //     this.labelOpenBet.node.active = true;
          //     flashBanner(this.labelOpenBet.node, 1.5).start();
          //   })
          //   .start(
          //     this.labelOpenBet.node.active = false,
          //     this.labelStopBet.node.active = true
          //   );
        })
        .start();
    },

    _stopBetProgress: function () {
      if (!this.progressTimer) return;
      cc.Tween.stopAllByTarget(this.progressTimer);
      this.progressTimer.node.parent.active = false;
    },

    _tickTimer: function (dt) {
      if (!this.isTimer) return;

      // tăng tốc độ đếm: sau 17s thật, timer từ 20 -> 0
      this.timer -= dt * this.speed;

      if (this.timer <= 0) {
        this.timer = 0;
        this.unschedule(this._tickTimer);
        this.lbTimer.string = "0";
        if (this.progressTimer) this.progressTimer.progress = 0;
        return;
      }

      const newTimeInt = Math.ceil(this.timer);
      if (newTimeInt !== this.timeInt) {
        this.timeInt = newTimeInt;
        this.lbTimer.string = this.timeInt;
        if (this.timeInt <= 3 && this.currentState === cc.XXState.BETTING) {
          this.lbTimer.node.color = cc.Color.RED;
        }
      }

      // progress theo tỷ lệ còn lại (không hardcode 20)
      if (this.progressTimer && this.currentState === cc.XXState.BETTING) {
        this.progressTimer.progress = this.timer / this.totalTime;
      }
    },

    updateTimer: function (time) {
      // cc.log('time ==> ' + time);
      if (this.labelProgress) {
        this.labelProgress.string = time + " Giây";
      }
      var timeInt = time;
      this.timeInt = timeInt;

      if (timeInt > 0) {
        this.lbTimer.string = timeInt;
      }

      if (this.progressTimer) {
        switch (this.currentState) {
          case cc.XXState.BETTING:
            const steps = 20; // chia nhỏ thành 20 lần
            const startProgress = time / 20;
            const endProgress = (time - 1) / 20;

            for (let i = 1; i <= steps; i++) {
              const t = i;
              const value =
                startProgress - (startProgress - endProgress) * (t / steps);
              this.timeouts.push(
                setTimeout(() => {
                  if (this.progressTimer) {
                    this.progressTimer.progress = Math.max(0, value);
                  }
                }, i * 50)
              ); // mỗi 50ms
            }
            break;
        }
      }
    },
    reset: function () {
      this.isTimer = false;
      this.timer = 0;
      this.timeInt = 0;
      this.currentState = 999;
      this.unschedule(this._tickTimer); // dừng schedule
      if (this.interval !== null) {
        clearInterval(this.interval);
      }
    },
    getTime: function () {
      return this.timeInt;
    },

    updateSessionId: function (sID) {
      this.lbSID.string = "Phiên: #" + sID;
    },

    updateInfo: function (info, state, time) {
      var self = this;
      //check state de xu ly hien thi
      switch (state) {
        //giai doan dat cuoc
        case cc.XXState.BETTING:
          //this.updateTimer(time); //54
          if (this.currentState !== state) {
            // console.log("BETTING");
            this.updateSessionId(info.SessionID);
            cc.XXController.getInstance().setSID(info.SessionID);
            // this.startTimer(time); // 🟢 GỌI Ở ĐÂY

            this.progressTimer.node.parent.active = true;
            this._startBetProgress(time);

            this.resetPlayersResultUI();
            //this.lbTimer.node.color = cc.Color.GREEN;
            this.lbInfo.string = "Đặt cửa";
            this.animInfo.play("xxInfo");

            //this.nodeBorderMiniGame.active = false;
            this.playAnimationSpin(true, "loop");
            this.nodeMiniGame.active = false;
            this.lbTimer.node.active = true;
            // if (this.animationTimeBet.node.active == false) {
            //     this.animationTimeBet.node.active = true;
            //     this.animationTimeBet.clearTracks();
            //     this.animationTimeBet.setToSetupPose();
            //     this.animationTimeBet.setAnimation(1, "appear", false);
            // }
            this.nodeMiniGame.active = true;
            // this.bgche.opacity = 40;
            this.spinColumnViews.forEach(function (spinColumnView) {
              spinColumnView.spin(1);
            });
            // this.scheduleOnce(() => {
            //   this.progressTimer.node.parent.active = true;
            //   this._startBetProgress(time - 3); // 🟢 BẮT ĐẦU TỪ 3 GIÂY TRƯỚC
            // }, 2);
          }
          break;

        //giai doan mo dia
        case cc.XXState.OPEN_PLATE:
          console.log("OPEN_PLATE");
          if (this.currentState !== state) {
            this.updateSessionId(info.SessionID);
            cc.XXController.getInstance().setSID(info.SessionID);
            // console.log("OPEN_PLATE");
            this.progressTimer.node.parent.active = false;
            // this.startTimer(time);
            this.resetPlayersResultUI();
            //this.lbTimer.node.color = cc.Color.WHITE;
            this.lbInfo.string = "Mở bát";
            this.animInfo.play("xxInfo");
            this.playAnimationCuoc("disapear");
            this.lbTimer.node.active = false;
            this.playAnimationSpin(false, "roll stop");
            this.bgche.opacity = 180;
            const self = this;
            this.scheduleOnce(() => {
              self.spinColumnViews.forEach(function (spinColumnView, index) {
                self.scheduleOnce(() => {
                  spinColumnView.randomAllIcon();
                  spinColumnView.stop();
                }, index * 0.3);
              });
            }, 2.2);
          }
          break;

        //giai doan ket qua
        case cc.XXState.SHOW_RESULT: //15
          if (this.currentState !== state) {
            this.updateSessionId(info.SessionID);
            cc.XXController.getInstance().setSID(info.SessionID);
            console.log("SHOW_RESULT");
            this.progressTimer.node.parent.active = false;
            // this.startTimer(time);
            //this.lbTimer.node.color = cc.Color.WHITE;
            this.animationTimeBet.node.active = false;
            this.lbTimer.node.active = false;
            this.lbInfo.string = "Kết quả";
            this.animInfo.play("xxInfo");
            this.bgche.opacity = 255;
          }
          break;

        //giai doan cho phien moi
        case cc.XXState.WAITING:
          if (this.currentState !== state) {
            this.updateSessionId(info.SessionID);
            cc.XXController.getInstance().setSID(info.SessionID);
            // console.log("Waiting for new session");
            this.progressTimer.node.parent.active = false;
            // this.startTimer(time);
            this.resetPlayersResultUI();
            //this.lbTimer.node.color = cc.Color.WHITE;
            // this.lbInfo.string = 'Đợi phiên mới';
            // this.animInfo.play('xxInfo');
            //this.nodeBorderMiniGame.active = false;
            this.lbTimer.node.active = false;
            this.nodeMiniGame.active = false;
            this.bgche.opacity = 255;
          }
          break;

        //giai doan xoc dia
        case cc.XXState.SHAKING:
          if (this.currentState !== state) {
            this.updateSessionId(info.SessionID);
            console.log("SHAKING");
            cc.XXController.getInstance().clearAllChip();
            this.progressTimer.node.parent.active = false;
            // this.startTimer(time);
            this.resetPlayersResultUI();
            this.lbTimer.node.active = false;
            this.animationTimeBet.node.active = false;
            this.bgche.opacity = 255;
            //this.lbTimer.node.color = cc.Color.WHITE;
            // this.lbInfo.string = 'Xóc xóc';
            // this.animInfo.play('xxInfo');
          }
          break;
      }

      //luu lai state hien tai
      this.currentState = state;
    },
    playAnimationSpin: function (loop, aniName) {
      this.nodeBgMiniGame.clearTracks();
      this.nodeBgMiniGame.setToSetupPose();
      this.nodeBgMiniGame.setAnimation(1, aniName, loop);
    },
    playAnimationCuoc: function (aniName) {
      this.animationTimeBet.node.active = false;
      this.animationTimeBet.clearTracks();
      this.animationTimeBet.setToSetupPose();
      this.animationTimeBet.setAnimation(1, aniName, false);
    },
  });
}).call(this);
