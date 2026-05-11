/**
 * Created by Nofear on 3/15/2019.
 */

(function () {
    cc.TaiXiuTopView = cc.Class({
        "extends": cc.PopupBase,
        properties: {
            taiXiuTopListView: cc.TaiXiuTopListView,
   //         TaiXiuTopListViewHistory: cc.TaiXiuTopListViewHistory,
    //        document: cc.Node,
            timecount: cc.Label,
   //         tab1: cc.Node,
    //        tab2: cc.Node,
   //         tabcontent1: cc.Node,
    //        tabcontent2: cc.Node,
            lbldaytab2: cc.Label,
            btnnext: cc.Node,
            btnprev: cc.Node,
        },
        
        onLoad: function () {
            this.animation = this.node.getComponent(cc.Animation);
            this.node.zIndex = cc.NoteDepth.POPUP_TAIXIU;
        },

        onEnable: function () {
            var self = this;
            var delay = 0.2;
            cc.director.getScheduler().schedule(function () {
                self.getTopSessionWinners();
            }, this, 1, 0, delay, false);

            this.animation.play('openPopup');
            this.timeNumNapthe = 0;
            this.startCountDown();
      //      this.tabcontent1.active = true;
     //       this.tabcontent2.active = false;
            
            // var date = new Date();
            // this.daysearch  = date.getDate(); 
           
            this.daynow = new Date().toJSON().slice(0, 10);
            this.daysearch = new Date().toJSON().slice(0, 10);

            

        },

        getTopSessionWinners: function () {
             //console.log(this.daysearch);
            var txGetBigWinnersCommand = new cc.TXGetBigWinnersCommand;
            txGetBigWinnersCommand.execute(this);
        },

        onTXGetBigWinnersResponse: function (response) {
            var list = response;
            //var list = slotsHistoryListData;
            if (list !== null && list.length > 0) {
                this.taiXiuTopListView.resetList();
                this.taiXiuTopListView.initialize(list);
            }
        },

        closeClicked: function () {
            this.taiXiuTopListView.resetList();
     //       this.TaiXiuTopListViewHistory.resetList();
            this.animation.play('closePopup');
            var self = this;
            var delay = 0.12;
            cc.director.getScheduler().schedule(function () {
                self.animation.stop();
                cc.TaiXiuMainController.getInstance().destroyTopView();
            }, this, 1, 0, delay, false);
        },
        opendocument: function () {
            this.document.active = true;
        },
        closedocument: function () {
            this.document.active = false;
        },
        startCountDown: function () {
            let numbernowtime = new Date().getTime();
            let todaystring = new Date().toJSON().slice(0, 10) + ' 23:59:59';
            let numberNaptheTime = new Date(todaystring).getTime();
            this.timeNumNapthe = 30 * 24 * 60 * 60 * 1000 - (numbernowtime - numberNaptheTime);

            this.timecount.string = this.convertNumbertoDate(this.timeNumNapthe);
            this.callbackSchedule = function(){
                this.timeNumNapthe = this.timeNumNapthe - 1000;
                this.timecount.string = this.convertNumbertoDate(this.timeNumNapthe);
            }
            this.schedule(this.callbackSchedule,1);
        },
        convertNumbertoDate: function (number) {
            let ketqua = '';
            let ngay =Math.floor(number/(24*60*60*1000));
          //  ketqua += ngay + "N ";
            let timeConlai = 0;
            timeConlai = number - (ngay*24*60*60*1000);
            let hour = Math.floor(timeConlai/(60*60*1000));
            ketqua += hour >= 10 ? hour + ":" : "0" + hour + ":";
            timeConlai = timeConlai - (hour*60*60*1000);
            let minute = Math.floor(timeConlai/(60*1000));
            ketqua += minute >= 10 ? minute + ":" : "0" + minute + ":";
            timeConlai = timeConlai - (minute*60*1000);
            let second = Math.floor(timeConlai/(1000));
            ketqua += second >= 10 ? second + "" : "0" + second;
            return ketqua;
        },
   //     activdetab: function (customevent,value) {
   //         if(value == 0){
   //             this.tabcontent1.active = true;
   //             this.tabcontent2.active = false;
   //         }
   //         if(value == 1){
   //             this.tabcontent1.active = false;
   //             this.tabcontent2.active = true;
   //             var date = new Date();
   //             date.setDate(date.getDate() - 1);
   //             this.daysearch = date.toJSON().slice(0, 10);
   //             this.lbldaytab2.string = this.formatDate(this.daysearch);
   //             this.getTopSessionWinners();
   //         }
   //     },
        actnext: function () {
            if(this.daysearch == this.daynow){
                this.btnnext.opacity = 150;
            }else{
                this.btnnext.opacity = 255;
                var day = new Date(this.daysearch);
                var nextDay = new Date();
                nextDay.setDate(day.getDate() + 1);
                this.daysearch =  nextDay.toJSON().slice(0, 10);
                this.lbldaytab2.string = this.formatDate(this.daysearch);
                this.getTopSessionWinners();
            }
        },
        actprev: function () {
            this.btnnext.opacity = 255;
            var day = new Date(this.daysearch);
            var nextDay = new Date();
            nextDay.setDate(day.getDate() - 1);
            this.daysearch =  nextDay.toJSON().slice(0, 10);

            this.lbldaytab2.string = this.formatDate(this.daysearch);
            this.getTopSessionWinners();
        },
        formatDate: function(input) {
            input = input.replaceAll('-', '/');
              var datePart = input.match(/\d+/g),
              year = datePart[0].substring(0), // get only two digits
              month = datePart[1], day = datePart[2];

          return day+'/'+month+'/'+year;
        }

    });
}).call(this);
