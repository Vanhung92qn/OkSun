(function () {
  cc.LodeResultView = cc.Class({
    extends: cc.Component,
    properties: {
      lbTitle: cc.Label,
      lbTimer: cc.Label,
      lbGDB: cc.Label,
      lbG1: cc.Label,
      lbG2: [cc.Label],
      lbG3: [cc.Label],
      lbG4: [cc.Label],
      lbG5: [cc.Label],
      lbG6: [cc.Label],
      lbG7: [cc.Label],
      btnPrevResult: cc.Button,
      btnNextResult: cc.Button,
      colorWait: cc.Color,
      colorBet: cc.Color,
      lbNotifyTimeWait: cc.Label,
      lbDateBet: cc.Label,
    },
    onLoad: function () {
      this.controller = cc.LodeController.getInstance();
      this.controller.setLodeResultView(this);
      this.fixTime = null;
      let self = this;
      this.currentDateResult = new Date();

      let date = this.currentDateResult.getDate();
      let month = this.currentDateResult.getMonth() + 1;
      let hour = this.currentDateResult.getHours();
      let monthStr = month.toString();

      if (month < 10) {
        monthStr = "0" + month;
      }

      if (hour > 19) {
        // date = date + 1;
        let dateStr = date.toString();

        if (date < 10) {
          dateStr = "0" + date;
        }
        this.lbDateBet.string = dateStr + "-" + monthStr;
      } else {
        let dateStr = date.toString();

        if (date < 10) {
          dateStr = "0" + date;
        }

        this.lbDateBet.string = dateStr + "-" + monthStr;
      }

      this.clearResult();
      self.updateTimeCount();
      this.getHistoryResult(0);
      this.interval = setInterval(function () {
        self.updateTimeCount();
      }, 1000);
    },
    onEnable: function () {
      this.dayAgo = 0;
    },
    onDestroy: function () {
      try {
        clearInterval(this.interval);
      } catch (e) {
      }
    },
    updateTimeCount: function () {
      if (!this.fixTime) {
        return;
      }

      this.fixTime--;
      if (this.fixTime <= 0) {
        this.fixTime = 0;
      }
      let msec = this.fixTime * 1000;
      let hh = Math.floor(msec / 1000 / 60 / 60);
      msec -= hh * 1000 * 60 * 60;
      let mm = Math.floor(msec / 1000 / 60);
      msec -= mm * 1000 * 60;
      let ss = Math.floor(msec / 1000);
      msec -= ss * 1000;

      hh = hh < 10 ? "0" + hh : hh;
      mm = mm < 10 ? "0" + mm : mm;
      ss = ss < 10 ? "0" + ss : ss;

      this.lbTimer.string = `${hh}:${mm}:${ss}`;
    },
    updateDataResult: function (data) {
      this.currPharse = parseInt(data.Phrase);
      this.controller.setCurrPharse(this.currPharse);
      this.fixTime = parseInt(data.Elapsed);
      this.updateUITimer();
      let result = data.Result;
      try {
        //Format currentDateResult
        //dd/mm/yyyy --> mm/dd/yyyy
        let lstDate = result.DateResult.split("/");
        let strFormatDate = `${lstDate[1]}/${lstDate[0]}/${lstDate[2]}`;
        let newDate = new Date(strFormatDate);
        this.controller.setCurrDateResult(newDate);
        this.setResultUI(result);
      } catch (e) {
        let setCurrDateResult = new Date(data.OpenDate);
        setCurrDateResult.setDate(setCurrDateResult.getDate() - 1);
        this.controller.setCurrDateResult(setCurrDateResult);
        this.setResultUI(result);
      }

      this.controller.setOpenDate(new Date(data.OpenDate));
    },
    updateUITimer: function () {
      let color = this.colorBet;
      let strNotifyTime = "Thời gian còn lại:";
      if (this.currPharse === cc.LodePharse.WAITING) {
        color = this.colorWait;
        strNotifyTime = "Thời gian chờ:";
      }
      this.lbNotifyTimeWait.string = strNotifyTime;
      this.lbNotifyTimeWait.node.color = color;
      this.lbTimer.node.color = color;
    },

    //Hien thi ket qua ra UI
    setResultUI: function (result) {
      try {
        // let strTile = "";
        
        // if (result.DateResult && result.DateResult.length > 0) {
        //   strTile += cc.Tool.getInstance().formatDate3(result.DateResult);
        // } else {
        //   strTile = cc.Tool.getInstance().formatDate3(
        //     cc.LodeController.getInstance().getCurrentDateResult()
        //   );
        // }
        // this.lbTitle.string = strTile;        //DB
        let specialPrizeData = result.SpecialPrizeData;
        //G1
        let firstPrizeData = result.FirstPrizeData;
        //G2
        let secondPrizeData = result.SecondPrizeData;
        //G3
        let thirdPrizeData = result.ThirdPrizeData;
        //G4
        let fourthPrizeData = result.FourthPrizeData;
        //G5
        let fifthPrizeData = result.FifthPrizeData;
        //G6
        let sixthPrizeData = result.SixthPrizeData;
        //G7
        let seventhPrizeData = result.SeventhPrizeData;

        if (result) {
          this.lbGDB.string = specialPrizeData ? specialPrizeData : "";
          this.lbG1.string = firstPrizeData ? firstPrizeData : "";

          this.mapResultPrizeToUI(secondPrizeData, this.lbG2);
          this.mapResultPrizeToUI(thirdPrizeData, this.lbG3);
          this.mapResultPrizeToUI(fourthPrizeData, this.lbG4);
          this.mapResultPrizeToUI(fifthPrizeData, this.lbG5);
          this.mapResultPrizeToUI(sixthPrizeData, this.lbG6);
          this.mapResultPrizeToUI(seventhPrizeData, this.lbG7);
        } else {
          this.clearResult();
        }
      } catch (ex) {
      }
    },
    //Map lb ket qua
    mapResultPrizeToUI: function (dataPrizes, lbPrizes) {
      lbPrizes.map((lb, index) => {
        lb.string = dataPrizes ? dataPrizes.split(",")[index] : "";
      });
    },
    //Xem ket qua ngay trc
    getPreviousResult: function () {
      this.dayAgo--;
      this.checkActiveBtnViewHistory();
      this.getHistoryResult(-1);
    },
    //Xem ket qua ngay tiep theo
    getNextResult: function () {
      this.dayAgo++;
      this.checkActiveBtnViewHistory();
      this.getHistoryResult(1);
    },
    //Xu ly click xem ket qua
    checkActiveBtnViewHistory: function () {
      this.btnNextResult.interactable = true;
      this.btnNextResult.node.opacity = 255;
      this.btnPrevResult.interactable = true;
      this.btnPrevResult.node.opacity = 255;
      //Cho phep click xem 1 ngay tiep theo
      if (this.dayAgo >= 1) {
        this.dayAgo = 1;
        //deactive next
        this.btnNextResult.interactable = false;
        this.btnNextResult.node.opacity = 150;
      }
      //Cho phep click xem ket qua 7 ngay trc
      if (this.dayAgo <= -7) {
        this.dayAgo = -7;
        this.btnPrevResult.interactable = false;
        this.btnPrevResult.node.opacity = 150;
      }
    },
    //Goi service xem ket qua
    //Params direct: xem ngay hom trc (-1) / ngay hom sau (1)
    getHistoryResult: function (direct) {
      let sessionResultCommand = new cc.LodeGetSessionResultCommand();
      let date = this.currentDateResult.getDate();
      //direct -1: ngay hom truoc
      //diect 1: ngay tiep theo
      this.currentDateResult.setDate(date + direct);
      this.controller.setCurrDateResult(this.currentDateResult);
      let day = cc.Tool.getInstance().formatDate2(this.currentDateResult);
      //this.lbTitle.string = day;
      let openDate = `${
        this.currentDateResult.getMonth() + 1
      }-${this.currentDateResult.getDate() - 1}-${this.currentDateResult.getFullYear()}`;
      this.lbTitle.string = `${this.currentDateResult.getDate() - 1}-${
        this.currentDateResult.getMonth() + 1
      }-${this.currentDateResult.getFullYear()}`;;
      sessionResultCommand.execute(this, openDate);
    },
    //API response ket qua
    onGetHistoryResponse: function (result) {
      try {
        if (result) {
          this.setResultUI(result);
        } else {
          this.clearResult();
        }
      } catch (e) {
        this.clearResult();
      }
    },
    //Reset view UI lb ket qua
    clearResult: function () {
      this.lbGDB.string = "";
      this.lbG1.string = "";
      this.mapResultPrizeToUI(null, this.lbG2);
      this.mapResultPrizeToUI(null, this.lbG3);
      this.mapResultPrizeToUI(null, this.lbG4);
      this.mapResultPrizeToUI(null, this.lbG5);
      this.mapResultPrizeToUI(null, this.lbG6);
      this.mapResultPrizeToUI(null, this.lbG7);
    },
  });
}.call(this));
