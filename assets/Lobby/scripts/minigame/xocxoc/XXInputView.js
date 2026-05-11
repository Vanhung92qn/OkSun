/**
 * Created by Welcome on 5/28/2019.
 */

const players = require("PlayerData").players;

(function () {
  cc.XXInputView = cc.Class({
    extends: cc.Component,
    properties: {
      nodeParentChip: cc.Node,

      btnBetVals: [cc.Button],
      btnChips: [cc.Button],
      btnBet: cc.Node,

      btnX2: cc.Button,
      btnRepeat: cc.Button,

      spriteNan: cc.Sprite,

      //totalBet các cửa
      lbTotalBets: [cc.Label],
      nodeSideBets: [cc.Node],

      //totalBet các cửa của user
      lbTotalUserBets: [cc.Label],
      scrollChip: cc.ScrollView,
    },
    update: function (dt) {
      this.btnX2.node.active = this.btnX2.interactable;
      this.btnRepeat.node.active = this.btnRepeat.interactable;
    },

    onLoad: function () {
      this.btnX2.node.active = false;
      this.btnRepeat.node.active = false;
      cc.XXController.getInstance().setXXInputView(this);
      this.percentScroll = 0;
      this.scrollChip.scrollToPercentHorizontal(this.percentScroll, 0.1);
      //danh dau che do Nan
      this.isNan = false;
      cc.XXController.getInstance().setIsNan(this.isNan);

      this.nodeChipPress = [];
      var self = this;
      this.btnChips.forEach(function (btnChip, i) {
        // console.log('btnChip', i, btnChip);
        const chooseNode = btnChip.node.getChildByName("choose");
        if (chooseNode) {
          // console.log('btnChip chooseNode', i, chooseNode);
          self.nodeChipPress.push(chooseNode);
        } else {
          console.warn('❌ Missing "choose" child in btnChip at index', i);
          self.nodeChipPress.push(null); // giữ thứ tự để không lệch
        }
      });
      this.activebutton = 0;
      this.pointxbtnbet = -275;
      let point = 57.5;
      cc.tween(this.btnBet)
        .to(0.1, { position: cc.v2(this.pointxbtnbet, 0) })
        .start();
      for (var i = 0; i < this.btnChips.length; i++) {
        if (!this.btnChips[i] || !this.btnChips[i].node) {
          console.warn('❌ Missing btnChips at index', i);
          continue;
        }
        cc.tween(this.btnChips[i].node)
          .to(0.1, { position: cc.v2(point, 22) })
          .start();
        point = point + 145;
      }
      this.minXs = [0, 0, 0, 0, 0, 0];
      this.maxXs = [0, 0, 0, 0, 0, 0];
      this.minYs = [0, 0, 0, 0, 0, 0];
      this.maxYs = [0, 0, 0, 0, 0, 0];
      for (var i = 0; i < 6; i++) {
        var sideNode = this.nodeSideBets[i];
        if (!sideNode) {
          console.warn('❌ Missing nodeSideBets at index', i);
          continue;
        }
        this.minXs[i] = sideNode.position.x - 50;
        this.maxXs[i] = sideNode.position.x + 50;
        this.minYs[i] = sideNode.position.y - 50;
        this.maxYs[i] = sideNode.position.y;
      }

      //vi tri dealer
      this.rootDealerPos = cc.v2(0, 128.989);

      //index chip
      this.chipIndex = 0;

      //mang cac gia tri Bet (map voi button)
      this.betVals = [
        1000, 5000, 10000, 50000, 100000, 500000, 1000000, 5000000, 10000000,
        20000000, 50000000,
      ];
      this.processBetValUI();

      //reset lastBetData
      cc.XXController.getInstance().setLastBetData(null);

      //reset totalBetUI
      this.resetTotalBetUI();

      //thoi gian giua cac lan dat (minisecond)
      this.timePerBet = 100;

      this.currentState = -1;

      //arr timeout reBet
      this.timeouts = [];

      //Vi tri cua groupUser
      this.posGroupUser = cc.v2(714, 140);
      this.highlightBet(this.chipIndex);
      this.initGateChip();
      cc.XXController.getInstance().initLogBet();
    },
    initGateChip: function () {
      //Chip cua tung gate
      this.gateChips = [];
      //Khoi tao gateChip tung cua
      for (let i = 1; i <= 6; i++) {
        this.gateChips[i] = [];
      }
    },

    //HubOn - PlayerBet
    playerBet: function (info) {
      //dam bao joinGame xong moi xu ly - tranh loi server neu bi
      if (cc.XXController.getInstance().getPositions()) {
        var accID = info[0];
        var amount = info[1];
        var gate = info[2];
        var chip = info[3];

        cc.XXController.getInstance().updateChip(accID, chip);

        this.playFxUserBet(
          cc.XXController.getInstance().getIndexUIBetByAccID(accID),
          gate,
          this.getChipIndexFromValue(amount),
          true
        );
        // console.log('XXInputView playerBet accID: ' + accID + ', amount: ' + amount + ', gate: ' + gate + ', chip: ' + chip);
        //them tong dat o cac cua
        this.totalBets[gate - 1] += amount;
        this.lbTotalBets[gate - 1].string = cc.Tool.getInstance().formatMoney(
          this.totalBets[gate - 1] * 2
        );

        //them tong dat o cac cua (cua user)
        if (accID === cc.LoginController.getInstance().getUserId()) {
          cc.XXController.getInstance().setLogBet({
            AccountID: accID,
            Amount: amount,
            Gate: gate,
          });
          this.totalUserBets[gate - 1] += amount;
          this.lbTotalUserBets[gate - 1].string =
            cc.Tool.getInstance().formatNumberV2(this.totalUserBets[gate - 1]);
          this.lbTotalUserBets[gate - 1].node.parent.active = true;

          cc.DDNA.getInstance().betSummary(
            cc.DDNAGame.XOC_XOC,
            amount,
            cc.XXController.getInstance().getSID()
          );
        }
      }
    },

    reBet: function (betLog, isX2) {
      var self = this;
      var totalBet = 0;

      //tinh truoc tong tien de kiem tra balance
      //duyet qua cac luot bet
      betLog.forEach(function (bet) {
        totalBet += bet.Amount;
      });
      if (isX2) {
        totalBet *= 2;
      }

      // console.log('reBet totalBet: ' + totalBet);
      // console.log('reBet Số dư: ' + cc.BalanceController.getInstance().getBalance());

      //kiem tra so du du ko? -> ko đủ return luôn
      if (totalBet > cc.BalanceController.getInstance().getBalance()) {
        cc.PopupController.getInstance().showMessage("Số dư không đủ.");
        return;
      }

      //GỘP CHIP BET LẠI

      //tính tông số chip đặt các cửa
      var ODD = 0;
      var THREE_UP = 0;
      var THREE_DOWN = 0;
      var EVEN = 0;
      var FOUR_UP = 0;
      var FOUR_DOWN = 0;
      //duyet qua cac luot bet
      betLog.forEach(function (bet) {
        switch (bet.Gate) {
          case cc.XXGate.ODD:
            ODD += bet.Amount;
            break;
          case cc.XXGate.THREE_UP:
            THREE_UP += bet.Amount;
            break;
          case cc.XXGate.THREE_DOWN:
            THREE_DOWN += bet.Amount;
            break;
          case cc.XXGate.EVEN:
            EVEN += bet.Amount;
            break;
          case cc.XXGate.FOUR_UP:
            FOUR_UP += bet.Amount;
            break;
          case cc.XXGate.FOUR_DOWN:
            FOUR_DOWN += bet.Amount;
            break;
        }
      });
      var bet5M = 0; //đếm số bet
      var bet1M = 0; //đếm số bet
      var bet500K = 0; //đếm số bet
      var bet100K = 0; //đếm số bet
      var bet50K = 0; //đếm số bet
      var bet10K = 0; //đếm số bet
      var bet5K = 0; //đếm số bet
      var bet1K = 0; //đếm số bet
      var bet500 = 0; //đếm số bet
      var bet100 = 0; //đếm số bet

      //tổng số chip đặt các cửa
      var gates = [ODD, THREE_UP, THREE_DOWN, EVEN, FOUR_UP, FOUR_DOWN];
      //luu lai gia tri Bet da toi uu
      var bets = [];

      for (var i = 0; i < 6; i++) {
        bet5M = 0; //đếm số bet
        bet1M = 0; //đếm số bet
        bet500K = 0; //đếm số bet
        bet100K = 0; //đếm số bet
        bet50K = 0; //đếm số bet
        bet10K = 0; //đếm số bet
        bet5K = 0; //đếm số bet
        bet1K = 0; //đếm số bet
        bet500 = 0; //đếm số bet
        bet100 = 0; //đếm số bet

        totalBet = gates[i];
        if (isX2) {
          totalBet *= 2;
        }
        if (totalBet > 0) {
          bet5M = Math.floor(totalBet / 5000000);
          // console.log('bet5M: ' + bet5M, i);
          totalBet = totalBet - bet5M * 5000000;
        }
        //     console.log('totalBet: ', totalBet);
        if (totalBet > 0) {
          bet1M = Math.floor(totalBet / 1000000);
          // console.log('bet1M: ' + bet1M, i);
          totalBet = totalBet - bet1M * 1000000;
        }
        if (totalBet > 0) {
          bet500K = Math.floor(totalBet / 500000);
          // console.log('bet500K: ' + bet500K, i);
          totalBet = totalBet - bet500K * 500000;
        }

        if (totalBet > 0) {
          bet100K = Math.floor(totalBet / 100000);
          // console.log('bet100K: ' + bet100K, i);
          totalBet = totalBet - bet100K * 100000;
        }
        if (totalBet > 0) {
          bet50K = Math.floor(totalBet / 50000);
          // console.log('bet50K: ' + bet50K, i);
          totalBet = totalBet - bet50K * 50000;
        }

        if (totalBet > 0) {
          bet10K = Math.floor(totalBet / 10000);
          // console.log('bet10K: ' + bet10K, i);
          totalBet = totalBet - bet10K * 10000;
        }

        if (totalBet > 0) {
          bet5K = Math.floor(totalBet / 5000);
          // console.log('bet5K: ' + bet5K, i);
          totalBet = totalBet - bet5K * 5000;
        }

        if (totalBet > 0) {
          bet1K = Math.floor(totalBet / 1000);
          // console.log('bet1K: ' + bet1K, i);
        }
        if (totalBet > 0) {
          bet500 = Math.floor(totalBet / 500);
          // console.log('bet500: ' + bet500, i);
          totalBet = totalBet - bet500 * 500;
        }

        if (totalBet > 0) {
          bet100 = Math.floor(totalBet / 100);
          // console.log('bet100: ' + bet100, i);
        }
        for (var j = 0; j < bet5M; j++) {
          bets.push({
            Gate: i + 1,
            Amount: 5000000,
          });
        }

        for (var j = 0; j < bet1M; j++) {
          bets.push({
            Gate: i + 1,
            Amount: 1000000,
          });
        }

        for (var j = 0; j < bet500K; j++) {
          bets.push({
            Gate: i + 1,
            Amount: 500000,
          });
        }

        for (j = 0; j < bet100K; j++) {
          bets.push({
            Gate: i + 1,
            Amount: 100000,
          });
        }
        for (var j = 0; j < bet50K; j++) {
          bets.push({
            Gate: i + 1,
            Amount: 50000,
          });
        }

        for (j = 0; j < bet10K; j++) {
          bets.push({
            Gate: i + 1,
            Amount: 10000,
          });
        }

        for (j = 0; j < bet5K; j++) {
          bets.push({
            Gate: i + 1,
            Amount: 5000,
          });
        }

        for (j = 0; j < bet1K; j++) {
          bets.push({
            Gate: i + 1,
            Amount: 1000,
          });
        }
        for (j = 0; j < bet500; j++) {
          bets.push({
            Gate: i + 1,
            Amount: 500,
          });
        }

        for (j = 0; j < bet100; j++) {
          bets.push({
            Gate: i + 1,
            Amount: 100,
          });
        }
      }

      this.count = 0;
      //duyet qua cac luot bet

      this.timeouts = [];
      bets.forEach(function (bet) {
        self.timeouts.push(
          setTimeout(function () {
            if (self.currentState === cc.XXState.BETTING) {
              self.sendRequestReBet(bet);
            }
          }, self.timePerBet * self.count)
        );

        self.count++;
      });
    },

    sendRequestReBet: function (bet) {
      //kiem tra so du
      // console.log('XXInputView sendRequestReBet: ' + bet.Amount + ', gate: ' + bet.Gate);
      if (cc.BalanceController.getInstance().getBalance() < bet.Amount) {
        cc.PopupController.getInstance().showMessage("Số dư không đủ");
        return;
      } else {
        //send request
        cc.XXController.getInstance().sendRequestOnHub(
          cc.MethodHubName.BET,
          bet.Amount,
          bet.Gate
        );
      }
    },

    showLastInput: function (info) {
      // console.log('XXInput showLastInput');
      var self = this;
      var betLogs = info;
      //duyet qua betLog của tat ca player
      betLogs.forEach(function (betLog) {
        //duyet qua cac luot bet cua player
        betLog.forEach(function (bet) {
          self.playFxUserBet(
            cc.XXController.getInstance().getIndexUIBetByAccID(bet.AccountID),
            bet.BetSide,
            self.getChipIndexFromValue(bet.BetValue),
            false
          );

          //them tong dat o cac cua
          self.totalBets[bet.BetSide - 1] += bet.BetValue;
          self.lbTotalBets[bet.BetSide - 1].string =
            cc.Tool.getInstance().formatMoney(self.totalBets[bet.BetSide - 1]);

          //them tong dat o cac cua (cua user)
          if (bet.AccountID === cc.LoginController.getInstance().getUserId()) {
            cc.XXController.getInstance().setLogBet({
              AccountID: bet.AccountID,
              Amount: bet.BetValue,
              Gate: bet.BetSide,
            });
            self.totalUserBets[bet.BetSide - 1] += bet.BetValue;
            self.lbTotalUserBets[bet.BetSide - 1].string =
              cc.Tool.getInstance().formatNumber(
                self.totalUserBets[bet.BetSide - 1]
              );
            self.lbTotalUserBets[bet.BetSide - 1].node.parent.active = true;
          }
        });
      });
    },

    //lay ve player bet
    getPlayerBets: function () {
      return players;
    },

    //lay ve index loai Chip bet
    getChipIndexFromValue: function (betVal) {
      var index = 0;
      if (!this.betVals) return index;
      var length = this.betVals.length;
      for (var i = 0; i < length; i++) {
        if (betVal === this.betVals[i]) {
          index = i;
          break;
        }
      }
      return index;
    },

    //tat/bat cac button chuc nang
    activeAllButtonBet: function (enable) {
      this.btnBetVals.forEach(function (btnBet) {
        btnBet.interactable = enable;
      });
      var lastBetData = cc.XXController.getInstance().getLastBetData();

      if (lastBetData && lastBetData.length > 0) {
        this.btnX2.interactable = enable;
        this.btnRepeat.interactable = enable;
      } else {
        this.btnX2.interactable = false;
        this.btnRepeat.interactable = false;
      }
    },

    processBetValUI: function () {
      // console.log(this.btnChips);
      // console.log(this.btnChips.length);

      for (var i = 0; i < this.btnChips.length; i++) {
        if (this.btnChips[i]) {
          this.btnChips[i].interactable = true;
        }

        if (this.nodeChipPress && this.nodeChipPress[i]) {
          this.nodeChipPress[i].active = false;
        }
      }

      if (
        this.chipIndex >= 0 &&
        this.btnChips && this.chipIndex < this.btnChips.length &&
        this.btnChips[this.chipIndex] &&
        this.nodeChipPress && this.nodeChipPress[this.chipIndex]
      ) {
        this.btnChips[this.chipIndex].interactable = false;
        this.nodeChipPress[this.chipIndex].active = true;
      } else {
        console.warn(
          "❌ chipIndex out of bounds or missing nodeChipPress at index",
          this.chipIndex
        );
      }
    },

    //reset mang chip cac player
    resetInput: function () {
      // console.log('XXInput resetInput');
      players.forEach(function (player) {
        player.chips = [];
      });
    },

    clearAllTimeOut: function () {
      if (!this.timeouts) {
        this.timeouts = [];
        return;
      }
      this.timeouts.forEach(function (timeOut) {
        clearTimeout(timeOut);
      });
      this.timeouts = [];
    },

    resetTotalBetUI: function () {
      this.totalBets = [0, 0, 0, 0, 0, 0];
      this.totalUserBets = [0, 0, 0, 0, 0, 0];

      this.lbTotalBets.forEach(function (lbTotalBet) {
        lbTotalBet.string = "";
      });

      this.lbTotalUserBets.forEach(function (lbTotalUserBet) {
        lbTotalUserBet.node.parent.active = false;
      });
    },
    betOfAccount: function (data) { },
    //save lai du lieu last bet
    saveLastBetData: function () {
      /*var betLog = [];
            var uID = cc.LoginController.getInstance().getUserId();
            var player = players[0];
            // chipItem.betIndex = betIndex;
            // chipItem.gate = gate;
            // chipItem.playerId = playerId;
            var self = this;
            player.chips.forEach(function (chip) {
                betLog.push(
                    {
                        'AccountID': uID,
                        'Amount': self.betVals[chip.chipIndex],
                        'Gate': chip.gate
                    }
                );
            });*/
      let logBet = [...cc.XXController.getInstance().getLogBet()];

      cc.XXController.getInstance().setLastBetData(logBet);
    },

    updateInput: function (state) {
      //check state de xu ly hien thi
      // console.log("updateInput", state);
      switch (state) {
        //giai doan dat cuoc
        case cc.XXState.BETTING: //54
          if (this.currentState !== state) {
            this.clearAllTimeOut();
            this.resetInput();
            this.resetTotalBetUI();
            this.activeAllButtonBet(true);
          }

          break;
        //giai doan mo bat
        case cc.XXState.OPEN_PLATE:
          if (this.currentState !== state) {
            this.clearAllTimeOut();
            this.activeAllButtonBet(false);
            this.saveLastBetData();
          }
          break;

        //giai doan ket qua
        case cc.XXState.SHOW_RESULT: //15
          if (this.currentState !== state) {
            this.activeAllButtonBet(false);
          }
          break;

        //giai doan cho phien moi
        case cc.XXState.WAITING:
          if (this.currentState !== state) {
            this.resetInput();
            this.activeAllButtonBet(false);
            //Khoi tao logBet moi
            cc.XXController.getInstance().initLogBet();
          }
          break;
        //xoc dia
        case cc.XXState.SHAKING:
          if (this.currentState !== state) {
            this.resetTotalBetUI();
            this.resetInput();
            this.activeAllButtonBet(false);
          }
          break;
      }

      //luu lai state hien tai
      this.currentState = state;
    },
    // destroy
    onDestroy: function () {
      // console.log('XXInputView onDestroy');
      //clear all timeout
      this.clearAllTimeOut();
      //reset lastBetData
      cc.XXController.getInstance().initLogBet();
    },
    //Lay danh sach chip tung gate
    getGateChips: function () {
      return this.gateChips;
    },
    //hieu ung chip khi 1 user bet
    playFxUserBet: function (playerId, gate, chipIndex, isMove) {
      if (!this.minXs || !this.gateChips) {
        console.warn('❌ XXInputView not ready, skip playFxUserBet');
        return;
      }
      cc.AudioController.getInstance().playSound(cc.AudioTypes.CHIP_BET);

      var betIndex = gate - 1;
      var minX = this.minXs[betIndex] || 0;
      var maxX = this.maxXs[betIndex] || 0;
      var minY = this.minYs[betIndex] || 0;
      var maxY = this.maxYs[betIndex] || 0;

      var x = minX + Math.floor(Math.random() * Math.abs(maxX - minX));
      var y = minY + Math.floor(Math.random() * Math.abs(maxY - minY));

      var nodeChip = cc.XXController.getInstance().createChip();
      nodeChip.parent = this.nodeParentChip;

      let nodePosition = null;
      if (playerId != -1 && players[playerId]) {
        nodePosition = players[playerId].position;
      } else {
        nodePosition = this.posGroupUser;
      }
      nodeChip.position = nodePosition; //players[playerId].position;

      var chipItem = nodeChip.getComponent(cc.XXChipItem);
      //set vi tri bet
      chipItem.betIndex = betIndex;
      chipItem.gate = gate;
      chipItem.playerId = playerId;
      chipItem.position = nodePosition;

      //players[playerId].chips.push(chipItem);
      if (chipIndex == 8) {
        chipIndex == 7;
      }
      chipItem.setChip(chipIndex);

      if (isMove) {
        chipItem.moveTo(cc.v2(x, y));
      } else {
        chipItem.setPosition(cc.v2(x, y));
      }
      //Push chipItem vao mang
      if (this.gateChips[gate]) this.gateChips[gate].push(chipItem);
    },

    //hieu ung chip bay tu dealer -> ra ban
    playFxDealerPay: function (chipBet) {
      var self = this;
      if (!this.gateChips || !this.minXs) {
        console.warn('❌ XXInputView not ready, skip playFxDealerPay');
        return;
      }

      var nodeChip = cc.XXController.getInstance().createChip();
      nodeChip.parent = self.nodeParentChip;
      nodeChip.position = self.rootDealerPos; //vi tri dealer
      var chipItem = nodeChip.getComponent(cc.XXChipItem);
      chipItem.betIndex = chipBet.betIndex;
      chipItem.playerId = chipBet.playerId;
      chipItem.position = chipBet.position;
      //set loai chip theo ChipIndex luc bet
      chipItem.setChip(chipBet.chipIndex);
      if (this.gateChips[chipBet.gate]) this.gateChips[chipBet.gate].push(chipItem);

      //push chung chip pay vao chip bet
      //players[chipBet.playerId].chips.push(chipItem);

      //di chuyen den vi tri chip dang bet
      var indexBet = chipBet.betIndex;
      var minX = self.minXs[indexBet];
      var maxX = self.maxXs[indexBet];
      var minY = self.minYs[indexBet];
      var maxY = self.maxYs[indexBet];

      var x = minX + Math.floor(Math.random() * Math.abs(maxX - minX));
      var y = minY + Math.floor(Math.random() * Math.abs(maxY - minY));

      chipItem.moveTo(cc.v2(x, y));
    },

    //hieu ung chip bay tu ban -> den nguoi choi win
    playFxPay: function (chipBet) {
      // let positionEnd = null;
      // if(chipBet.playerId != -1) {
      //     positionEnd = players[chipBet.playerId].position
      // }else {
      //     positionEnd = this.posGroupUser;
      // }
      //chipBet.moveToEnd(players[chipBet.playerId].position);
      chipBet.moveToEnd(chipBet.position);
    },

    //hieu ung chip bay tu ban -> ve dealer
    playFxLost: function (chipBet) {
      //chip bet -> bay ve dealer
      chipBet.moveToEnd(this.rootDealerPos);

      // var self = this;
      // var chipBets = players[playerId].chips;
      // chipBets.forEach(function (chipBet) {
      //     //chip bet -> bay ve dealer
      //     chipBet.moveToEnd(self.rootDealerPos);
      // });
    },
    highlightBet: function (index) {
      // tắt Interval trước đó nếu có
      let btnChip = this.btnChips[index];
      if (this.highlightInterval) {
        btnChip.node.getChildByName("default").active = true;
        clearInterval(this.highlightInterval);
      }

      btnChip.node.getChildByName("default").active = true;
      btnChip.node.getChildByName("default").scale = 0.85;
      // nhấp nháy chip đang chọn
      // 0,5s
      // mỗi lần sẽ tất và mở lại hình Highlight bet
      // if (btnChip) {
      //     btnChip.node.getChildByName('choose').active = true;
      //     btnChip.node.getChildByName('default').active = false;
      // }
      // cc.tween(btnChip.node.getChildByName('choose'))
      //     .repeatForever(
      //         cc.tween().sequence(
      //             cc.tween().to(0.3, { scale: 1 }, { easing: cc.easing.sineOut }),
      //             cc.tween().to(0.3, { scale: 0.8 }, { easing: cc.easing.sineOut })))
      //     .start();
      // mỗi 0,5 giây tắt và mở lại hình Highlight
      this.highlightInterval = setInterval(() => {
        if (!btnChip || !cc.isValid(btnChip.node)) {
          clearInterval(this.highlightInterval);
          this.highlightInterval = null;
          return;
        }

        const chooseNode = btnChip.node.getChildByName("choose");
        if (!chooseNode) return;

        chooseNode.active = !chooseNode.active;
      }, 500);
    },
    //chon muc bet
    betValueClicked: function (event, data) {
      // console.log('XXInputView betValueClicked: ' + data);
      cc.AudioController.getInstance().playSound(cc.AudioTypes.CHIP_SELECT);
      this.chipIndex = parseInt(data.toString());
      var n = this.btnChips ? this.btnChips.length : 0;
      for (var i = 0; i < n; i++) {
        var b = this.btnChips[i];
        if (!b || !b.node) continue;
        var def = b.node.getChildByName("default");
        var cho = b.node.getChildByName("choose");
        if (def) def.active = true;
        if (cho) cho.active = false;
      }
      var sel = this.btnChips[data];
      if (sel && sel.node) {
        var selCho = sel.node.getChildByName("choose");
        var selDef = sel.node.getChildByName("default");
        if (selCho) selCho.active = true;
        if (selDef) selDef.active = false;
      }
      this.activebutton = data;
      // disable tat ca button bet
      for (var i = 0; i < n; i++) {
        this.disableBet(i);
      }
      this.highlightBet(this.chipIndex);
      // this.highlightBet(data.
      this.processBetValUI();
    },

    //dat cua
    betClicked: function (event, data) {
      if (cc.XXController.getInstance().getTime() <= 0) {
        cc.PopupController.getInstance().showMessage(
          "Đã hết thời gian đặt cửa."
        );
        cc.XXController.getInstance().activeAllButtonBet(false);
        return;
      }

      this.indexBet = parseInt(data.toString());
      var betVal = this.betVals[this.chipIndex];
      // console.log('XXInputView betClicked indexBet: ' + this.indexBet + ', betVal: ' + betVal);
      //kiem tra so du
      if (cc.BalanceController.getInstance().getBalance() < betVal) {
        cc.PopupController.getInstance().showMessage("Số dư không đủ");
        return;
      } else {
        //send request
        cc.XXController.getInstance().sendRequestOnHub(
          cc.MethodHubName.BET,
          betVal,
          this.indexBet + 1
        );
        //dat -> tat luon nut X2 + reBet
        this.btnX2.interactable = false;
        this.btnRepeat.interactable = false;
      }
    },

    //tat/bat che do Nan
    nanClicked: function () {
      this.isNan = !this.isNan;
      if (this.isNan) {
        this.spriteNan.spriteFrame = cc.XXController.getInstance().getNans()[0];
      } else {
        this.spriteNan.spriteFrame = cc.XXController.getInstance().getNans()[1];
      }

      cc.XXController.getInstance().setIsNan(this.isNan);
    },

    x2Clicked: function () {
      if (cc.XXController.getInstance().getTime() <= 3) {
        cc.PopupController.getInstance().showMessage(
          "Đã hết thời gian đặt cửa."
        );
        cc.XXController.getInstance().activeAllButtonBet(false);
        return;
      }

      var lastBetData = cc.XXController.getInstance().getLastBetData();
      if (lastBetData && lastBetData.length > 0) {
        this.reBet(lastBetData, true);
        this.btnX2.interactable = false;
        this.btnRepeat.interactable = false;
      } else {
        cc.PopupController.getInstance().showMessage(
          "Không có dữ liệu đặt của phiên trước."
        );
      }
    },

    repeatClicked: function () {
      if (cc.XXController.getInstance().getTime() <= 3) {
        cc.PopupController.getInstance().showMessage(
          "Đã hết thời gian đặt cửa."
        );
        cc.XXController.getInstance().activeAllButtonBet(false);
        return;
      }

      var lastBetData = cc.XXController.getInstance().getLastBetData();
      if (lastBetData && lastBetData.length > 0) {
        this.reBet(lastBetData);
        this.btnX2.interactable = false;
        this.btnRepeat.interactable = false;
      } else {
        cc.PopupController.getInstance().showMessage(
          "Không có dữ liệu đặt của phiên trước."
        );
      }
    },

    //clear all chip
    clearAllChip: function () {
      this.nodeParentChip.removeAllChildren(true);
    },
    onBtnScrollLeft() {
      if (this.activebutton === 0) {
        return;
      }
      this.activebutton--;
      if (this.activebutton < 0) {
        this.activebutton = 0;
      }
      var n = this.btnChips ? this.btnChips.length : 0;
      for (var i = 0; i < n; i++) {
        var b = this.btnChips[i];
        if (!b || !b.node) continue;
        var def = b.node.getChildByName("default");
        var cho = b.node.getChildByName("choose");
        if (def) def.active = true;
        if (cho) cho.active = false;
      }
      var cur = this.btnChips[this.activebutton];
      if (cur && cur.node) {
        var curCho = cur.node.getChildByName("choose");
        var curDef = cur.node.getChildByName("default");
        if (curCho) curCho.active = true;
        if (curDef) curDef.active = false;
      }
      this.chipIndex = this.activebutton;
      this.highlightBet(this.chipIndex);
      this.disableBet(this.chipIndex + 1);
      //-286 vi tri ban dau cua thang cha
      if (this.activebutton > 0 && this.activebutton < 7) {
        let pointx = this.pointxbtnbet + 145;
        if (pointx <= -275) {
          cc.tween(this.btnBet)
            .to(0.1, { position: cc.v2(pointx, 0) })
            .start();
          this.pointxbtnbet = pointx;
        }
      }
    },
    disableBet: function (index) {
      let btnChip = this.btnChips ? this.btnChips[index] : null;
      if (btnChip && btnChip.node) {
        var def = btnChip.node.getChildByName("default");
        var cho = btnChip.node.getChildByName("choose");
        if (def) {
          def.scale = 0.65;
          def.active = true;
        }
        if (cho) cho.active = false;
      }
    },
    onBtnScrollRight() {
      var max = (this.btnChips ? this.btnChips.length : 11) - 1;
      if (this.activebutton >= max) {
        return;
      }
      this.activebutton++;
      if (this.activebutton > max) {
        this.activebutton = max;
      }
      for (var i = 0; i <= max; i++) {
        var b = this.btnChips[i];
        if (!b || !b.node) continue;
        var def = b.node.getChildByName("default");
        var cho = b.node.getChildByName("choose");
        if (def) def.active = true;
        if (cho) cho.active = false;
      }
      var cur = this.btnChips[this.activebutton];
      if (cur && cur.node) {
        var curCho = cur.node.getChildByName("choose");
        var curDef = cur.node.getChildByName("default");
        if (curCho) curCho.active = true;
        if (curDef) curDef.active = false;
      }
      //-286
      this.chipIndex = this.activebutton;
      // console.log('this.chipIndex: ' + this.chipIndex);

      this.highlightBet(this.chipIndex);
      this.disableBet(this.chipIndex - 1);
      if (this.activebutton > 3 && this.activebutton <= 10) {
        let pointx = this.pointxbtnbet - 145;
        // console.log('pointx: ' + pointx);

        if (pointx >= -1290) {
          cc.tween(this.btnBet)
            .to(0.1, { position: cc.v2(pointx, 0) })
            .start();
          this.pointxbtnbet = pointx;
        }
      }
    },
  });
}).call(this);
