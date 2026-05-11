/**
 * Created by Nofear on 3/15/2019.
 */
var shopConfig = require('ShopConfig');
 (function () {
    cc.MomoView = cc.Class({
        "extends": cc.Component,
        properties: {
            nodeActive: cc.Node,
            nodeDeActive: cc.Node,
            nodeDeForm:cc.Node,
            lbMoMoName: cc.Label,
            lbMoMoPhone: cc.Label,
            lbMoMoContent: cc.Label,
            lbMoMoContent2: cc.Label,
            lbtaocodemoi: cc.Label,
            btnConfirmYes: cc.Node,
            btnConfirmNo: cc.Node,
            timecode: cc.Label,
        },

        onLoad: function () {
           
            this._action = false;
                
        },
        onStart :function () {
            this._action = false;
             
        },
        onEnable: function () {
           
            this.onGetListMomo();
            this.lbtaocodemoi.string = 'Vui lòng tạo code mới.';
            this.nodeDeActive.active = false;
            this.lbMoMoContent.string = '-';
            this.lbMoMoContent2.string = '';
            this.checkbank();
        },
        checkbank: function () {
             let datacodepay = shopConfig.datamomopay;
             if(Object.keys(datacodepay).length > 0){
               
                if(datacodepay != null){
                    this.lbtaocodemoi.string = '';
                    this.lbMoMoContent.string = shopConfig.datamomopay.Message;
                    this.lbMoMoContent2.string = shopConfig.datamomopay.Message;
                    this.nodeDeActive.active = true;
                }
            }
            if(shopConfig.timemomopay > 0){

                this.unschedule(this.callbackSchedule);
                this.startCountDown(shopConfig.timemomopay);
                let numberNaptheTime = new Date().getTime();
                if(numberNaptheTime > shopConfig.timemomopay){
                    shopConfig.timemomopay = 0;
                    shopConfig.datamomopay = [];
                }
            }
        },

        onGetListMomo: function () {
            var getListMomoCommand = new cc.GetListMomoCommand;
            getListMomoCommand.execute(this);
        },
        

        onGetListMomoResponse: function (response) {
            this.lbMoMoName.string = response.Orders.WalletAccountName;
            this.lbMoMoPhone.string = response.Orders.WalletAccount;
            var orders = response.Orders;
            this.orders = orders;
            this.varrequestid = orders.Message;
        },

        onGetListMomoResponseError: function (response) {
            this.nodeActive.active = false;
        },

        copyMoMoAccountClicked: function () {
            if(cc.Tool.getInstance().copyToClipboard(this.lbMoMoPhone.string)) {
                cc.PopupController.getInstance().showMessage('Đã sao chép số tài khoản.');
            }
        },
        copyMoMoAccountNameClicked: function () {
            if(cc.Tool.getInstance().copyToClipboard(this.lbMoMoName.string)) {
                cc.PopupController.getInstance().showMessage('Đã sao chép tên tài khoản.');
            }
        },

        copyMoMoContentClicked: function () {
            if(cc.Tool.getInstance().copyToClipboard(this.lbMoMoContent.string)) {
                cc.PopupController.getInstance().showMessage('Đã sao chép nội dung chuyển khoản.');
            }
        },

        napTien: function (event) {
           
            this._action = true;
            this.lbtaocodemoi.string = '';
            this.lbMoMoContent.string = this.orders.Message;
            this.lbMoMoContent2.string = this.orders.Message;
            this.nodeDeActive.active = true;

        
            this.VarNganHang = 10;
            this.VarSoTk = this.lbMoMoPhone.string;
            this.VarNameTk = this.lbMoMoName.string;
            this.VarNguoigui = "";
            this.VarAmount = 50000;
            this.VarCodeValue = 'momo';
            this.VarBankName = 'MoMo';
            this.requestid = this.varrequestid;
            var Naptienbanking = new cc.Naptienbanking;
            Naptienbanking.execute(this);

        },
        onNaptienbankingResponseError:function(data){
            cc.PopupController.getInstance().showMessageError(data.Message);
        },
        onNaptienbankingResponse:function(data){
            shopConfig.datamomopay = this.orders;
            shopConfig.timemomopay = new Date().getTime() + 15*60*1000;
            this.startCountDown(shopConfig.timemomopay);
        },
        onEditingValueChanged: function () {
            var val = cc.Tool.getInstance().removeDot(this.editBoxMenhGia.string);
            this.editBoxMenhGia.string = cc.Tool.getInstance().formatNumber(val);
           // this.lbValueTransfer.string = 'Số ' + cc.Config.getInstance().currency() + ' cần chuyển: ' + this.editBoxMenhGia.string;
        },

        onEditingValueDidEnd: function () {
            var val = cc.Tool.getInstance().removeDot(this.editBoxMenhGia.string);
            this.editBoxMenhGia.string = cc.Tool.getInstance().formatNumber(val);
           //this.lbValueTransfer.string = 'Số ' + cc.Config.getInstance().currency() + ' cần chuyển: ' + this.editBoxMenhGia.string;
        },
        disableClicked: function () {
           var clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = this; //This node is the node to which your event handler code component belongs
            clickEventHandler.component = 'MomoView';//This is the code file name
            clickEventHandler.handler = 'quitRoomClicked2';
            cc.PopupController.getInstance().showPopupSimple(
                'Bạn đã tạo quá số lượng code cho phép với Ví điện tử momo',
                'OK',
                clickEventHandler
            );
        },
        quitRoomClicked2: function () {
            this.closePopup();
        },

        actmomoduyetphieu: function () {

            var clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = this; //This node is the node to which your event handler code component belongs
            clickEventHandler.component = 'MomoView';//This is the code file name
            clickEventHandler.handler = 'quitRoomClicked';
            cc.PopupController.getInstance().showPopupSimple(
                'Nạp tiền MoMo duyệt phiếu đang bảo trì, quý khách vui lòng nạp qua MoMo Auto',
                'OK',
                clickEventHandler
            );
        },
        quitRoomClicked: function () {
            this.closePopup();
        },

        closePopup: function () {
            cc.PopupController.getInstance().closePopup();
        },
        startCountDown: function (numbernowtime) {
            if(numbernowtime > 0){
                let numberNaptheTime = new Date().getTime();
                let timeNumNapthe = 30 * 24 * 60 * 60 * 1000 - (numberNaptheTime -numbernowtime  );
                this.timecode.string = this.convertNumbertoDate(timeNumNapthe);
                this.callbackSchedule = function(){
                    timeNumNapthe = timeNumNapthe - 1000;
                    this.timecode.string = this.convertNumbertoDate(timeNumNapthe);
                }
                this.schedule(this.callbackSchedule,1);
            }
        },
        convertNumbertoDate: function (number) {
            let ketqua = '';
            let ngay =Math.floor(number/(24*60*60*1000));
          //  ketqua += ngay + "N ";
            let timeConlai = 0;
            timeConlai = number - (ngay*24*60*60*1000);
            let hour = Math.floor(timeConlai/(60*60*1000));
            //ketqua += hour >= 10 ? hour + ":" : "0" + hour + ":";
            timeConlai = timeConlai - (hour*60*60*1000);
            let minute = Math.floor(timeConlai/(60*1000));
            ketqua += minute >= 10 ? minute + ":" : "0" + minute + ":";
            timeConlai = timeConlai - (minute*60*1000);
            let second = Math.floor(timeConlai/(1000));
            ketqua += second >= 10 ? second + "" : "0" + second;
            return ketqua;
        },

    });
}).call(this);
