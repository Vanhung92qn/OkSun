/**
 * Created by Nofear on 3/15/2019.
 */

var shopConfig = require('ShopConfig');
(function () {
    cc.TopupBankView = cc.Class({
        "extends": cc.Component,
        properties: {
            nodeStep1: cc.Node,
            nodeStep2: cc.Node,
            nodeHelp: cc.Node,
            //step1
            toggleChooseValue: cc.Node,
            lbSelectedBank: cc.Label,
            btnConfirmYes: cc.Node,
            //step2
            lbInfoBank: cc.Label,
            lbInfoBankAccountNumber: cc.Label,
            lbInfoBankAccountName: cc.Label,
            lbInfoBankAccountNote: cc.Label,
            lbInfoBankSoTien: cc.Label,
            lbtxtnotestep1: cc.Label,
            timecode: cc.Label,
            lbDesc: cc.Label,
            editBoxSoTien: cc.EditBox,
            listoptionbank: [cc.Node]
        },

        onLoad: function () {

            this.animOpenName = 'showDropdownMenu';
            this.animCloseName = 'hideDropdownMenu';

            // cc.TopupController.getInstance().setTopupView(this);

            // this.editBoxValue.placeholder = 'Số ' + cc.Config.getInstance().currency() + ' muốn nạp';

            cc.PopupController.getInstance().showBusy();

        },

        onEnable: function () {
            this.nodeStep1.active = true;
            this.nodeStep2.active = false;
            this.btnConfirmYes.active = true;
            // this.checkbank();
            // this.getListTopupBank();
        },

        checkbank: function () {
            let datacodepay = shopConfig.datacodepay;
            if (Object.keys(datacodepay).length > 0) {

                if (datacodepay != null) {
                    var orders = datacodepay;
                    this.banks = orders.List;
                    this.lbInfoBankAccountNumber.string = orders.List.phoneNum;
                    this.lbInfoBankAccountName.string = orders.List.phoneName;
                    this.banknote = orders.List.redirect;
                    // this.lbInfoBankAccountNote.string = this.banknote;
                    this.nodeStep1.active = true;
                    this.nodeStep2.active = true;
                    this.btnConfirmYes.active = false;
                }
            }
            if (shopConfig.timecodepay > 0) {

                this.unschedule(this.callbackSchedule);
                this.startCountDown(shopConfig.timecodepay);
                let numberNaptheTime = new Date().getTime();
                if (numberNaptheTime > shopConfig.timecodepay) {
                    shopConfig.timecodepay = 0;
                    shopConfig.datacodepay = [];
                }
            }
        },

        update: function (dt) {
            if (this.isTimerConfirm) {
                this.timerConfirm -= dt;
            }
        },

        activateLogo: function (enabled) {
            this.nodeLogoUSDTs.forEach(function (nodeLogo) {
                nodeLogo.active = enabled;
            });
        },

        choosebank: function (target, value) {
            console.log(target);
            console.log(value);
            this.lbSelectedBank.string = value;
            this.toggleChooseValue.active = false;
            var bankcode = '';
            if (value == 'Vietcombank') {
                bankcode = 'VCB';
            } else if (value == 'ACB') {
                bankcode = 'ACB';
            } else if (value == 'BIDV') {
                bankcode = 'BIDV';
            } else if (value == 'DongA') {
                bankcode = 'DAB';
            } else if (value == 'Sacombank') {
                bankcode = 'SCB';
            } else if (value == 'Techcombank') {
                bankcode = 'TCB';
            } else if (value == 'VietinBank') {
                bankcode = 'VTB';
            } else if (value == 'MB') {
                bankcode = 'MB';
            } else if (value == 'Agribank') {
                bankcode = 'AGR';
            }
            // for (var i = 0; i < this.listbankcodepay.length; i++) {
            //     var code = this.listbankcodepay[i].code;
            //     if (code == bankcode) {
            //         this.banks = this.listbankcodepay[i].name;
            //         this.bankCode = this.listbankcodepay[i].code;
            //         var chargeBankCommand = new cc.ChargeBankCommand;
            //         chargeBankCommand.execute(this);
            //     }
            // }
        },

        getListTopupBank: function () {
            var getListTopupBankCommand = new cc.GetListTopupBankCommand;
            getListTopupBankCommand.execute(this);
        },

        onGetListTopupBankResponse: function (response) {

            cc.BankController.getInstance().setResponseTopupBanks(response);
            if (response.Type) {
                this.type = response.Type;
            }
            for (var i = 0; i < 9; i++) {
                this.listoptionbank[i].active = false;
            }
            this.listbankcodepay = response.Orders.List;

            for (var i = 0; i < this.listbankcodepay.length; i++) {
                var code = this.listbankcodepay[i].code;
                if (code == 'ACB') {
                    this.listoptionbank[1].active = true;
                } else if (code == 'BIDV') {
                    this.listoptionbank[3].active = true;
                } else if (code == 'TCB') {
                    this.listoptionbank[2].active = true;
                } else if (code == 'VTB') {
                    this.listoptionbank[6].active = true;
                } else if (code == 'VCB') {
                    this.listoptionbank[0].active = true;
                } else if (code == 'MB') {
                    this.listoptionbank[7].active = true;
                }
            }

            var bankcode = this.listbankcodepay[0].code;

            if (bankcode == 'VCB') {
                value = 'Vietcombank';
            } else if (bankcode == 'ACB') {
                value = 'ACB';
            } else if (bankcode == 'BIDV') {
                value = 'BIDV';
            } else if (bankcode == 'DAB') {
                value = 'DongA';
            } else if (bankcode == 'SCB') {
                value = 'Sacombank';
            } else if (bankcode == 'TCB') {
                value = 'Techcombank';
            } else if (bankcode == 'VTB') {
                value = 'VietinBank';
            } else if (bankcode == 'MB') {
                value = 'MB';
            } else if (bankcode == 'AGR') {
                value = 'Agribank';
            }
            this.lbSelectedBank.string = value;
            this.toggleChooseValue.active = false;
            for (var i = 0; i < this.listbankcodepay.length; i++) {
                var code = this.listbankcodepay[i].code;
                if (code == bankcode) {
                    this.banks = this.listbankcodepay[i].name;
                    this.bankCode = this.listbankcodepay[i].code;
                    var chargeBankCommand = new cc.ChargeBankCommand;
                    chargeBankCommand.execute(this);
                }
            }


        },

        processTimeConfirm: function () {
            if (this.timerConfirm <= 0) {
                this.isTimerConfirm = false;
                this.btnConfirm.interactable = true;

                this.lbConfirms.forEach(function (lbConfirm) {
                    lbConfirm.string = 'Lấy thông tin';
                });
            } else {
                var self = this;
                var time = Math.round(self.timerConfirm);
                this.isTimerConfirm = true;
                this.btnConfirm.interactable = false;
                this.lbConfirms.forEach(function (lbConfirm) {
                    lbConfirm.string = time;
                });
            }
        },

        resetScale: function () {
            this.animationMenuBank.node.scaleY = 0;
            this.animationMenuBank.node.opacity = 255;
        },

        restoreScale: function () {
            this.animationMenuBank.node.scaleY = 1;
            this.animationMenuBank.node.opacity = 0;
        },

        resetInput: function () {
            if (this.editBoxValue) {
                this.editBoxValue.string = '';
                this.editBoxCaptcha.string = '';
                this.lbMoney.string = 'Số ' + cc.Config.getInstance().currency() + ' nhận được: ' + '0';
            }
        },

        setLBSelectedBank: function (bank) {
            this.lbSelectedBank.string = bank.name;
            this.banks = bank;
            this.bankCode = bank.code;


            var chargeBankCommand = new cc.ChargeBankCommand;
            chargeBankCommand.execute(this);
        },

        selectBank: function (value) {
            this.bankType = value;
        },

        onGetCaptchaResponse: function (response) {
            if (this.imageUrlCaptcha)
                this.imageUrlCaptcha.get('data:image/png;base64,' + cc.Tool.getInstance().removeStr(response[1], '\r\n'));
        },

        onChargeBankResponse: function (response) {
            //console.log(response);
            if (response != null) {
                var orders = response.Orders;
                this.orders = orders;
                this.banks = orders.List;
                this.lbDesc.string = orders.List.code;
                this.lbInfoBankAccountNumber.string = orders.List.phoneNum;
                this.lbInfoBankAccountName.string = orders.List.phoneName;
                //this.banknote = orders.List.redirect;
                this.varrequestid = orders.List.id;
                this.btnConfirmYes.active = true;
                this.nodeStep2.active = false;
            }
        },

        onChargeBankResponseError: function (response) {
            if (response.Description)
                cc.PopupController.getInstance().showMessageError(response.Description);
            else
                cc.PopupController.getInstance().showMessageError(response.Message, response.ResponseCode);

        },

        copyBankClicked: function () {

        },

        copyBankAccountNumberClicked: function () {
            if (this.banks != null && cc.Tool.getInstance().copyToClipboard(this.banks.phoneNum)) {
                cc.PopupController.getInstance().showMessage('Đã sao chép số tài khoản.');
            }
        },

        copyBankAccountNameClicked: function () {
            if (this.banks != null && cc.Tool.getInstance().copyToClipboard(this.banks.phoneName)) {
                cc.PopupController.getInstance().showMessage('Đã sao chép tên tài khoản.');
            }
        },


        copyMoneyValueClicked: function () {

        },

        copyTranIDClicked: function () {
            if (this.lbDesc && this.lbDesc.string && cc.Tool.getInstance().copyToClipboard(this.lbDesc.string)) {
                cc.PopupController.getInstance().showMessage('Đã sao chép nội dung chuyển khoản.');
            }
        },

        onEditingValueChanged: function () {
            var val = cc.Tool.getInstance().removeDot(this.editBoxValue.string);
            this.editBoxValue.string = cc.Tool.getInstance().formatNumber(val);

            //fix loi lam tron
            if (this.rate === 1.15
                && (val === 100 || val === 100000 || val === 100000000 ||
                    val === 200 || val === 200000 || val === 200000000 ||
                    val === 400 || val === 400000 || val === 400000000 ||
                    val === 700 || val === 700000 || val === 700000000 ||
                    val === 800 || val === 800000 || val === 800000000
                )) {
                var receive = Math.floor(val * this.rate) + 1;
            } else {
                receive = Math.floor(val * this.rate);
            }
            var receive = Math.round(val * this.rate);

            this.lbMoney.string = 'Số ' + cc.Config.getInstance().currency() + ' nhận được: ' + cc.Tool.getInstance().formatNumber(receive);
        },

        onEditingValueDidEnd: function () {
            var val = cc.Tool.getInstance().removeDot(this.editBoxValue.string);
            this.editBoxValue.string = cc.Tool.getInstance().formatNumber(val);

            //fix loi lam tron
            if (this.rate === 1.15
                && (val === 100 || val === 100000 || val === 100000000 ||
                    val === 200 || val === 200000 || val === 200000000 ||
                    val === 400 || val === 400000 || val === 400000000 ||
                    val === 700 || val === 700000 || val === 700000000 ||
                    val === 800 || val === 800000 || val === 800000000
                )) {
                var receive = Math.floor(val * this.rate) + 1;
            } else {
                receive = Math.floor(val * this.rate);
            }

            var receive = Math.round(val * this.rate);

            this.lbMoney.string = 'Số ' + cc.Config.getInstance().currency() + ' nhận được: ' + cc.Tool.getInstance().formatNumber(receive);
        },

        openMenuBankClicked: function () {
            this.toggleChooseValue.active = !this.toggleChooseValue.active;
        },

        hideMenuBankClicked: function () {
            this.animationMenuBank.play(this.animCloseName);
        },

        selectBankEvent: function (event, data) {
            this.bankCode = data.bankCode;
            this.selectBank(data.BankName);
            this.setLBSelectedBank(data);
            this.animationMenuBank.play(this.animCloseName);
        },

        chooseBankClicked: function (event, data) {
            this.selectBank(data.toString());
            this.setLBSelectedBank(data.toString());
        },

        refreshCaptchaClicked: function () {
            this.getCaptcha();
        },

        taocodeclicked: function () {
            // chạy loading
            if (this.editBoxSoTien.string === '') {
                cc.PopupController.getInstance().showMessage('Vui lòng nhập số tiền.');
                return;
            }
            cc.PopupController.getInstance().showBusy();
            // tầm 0,3 giây
            this.setUserName();
            console.log(cc.LoginController.getInstance().getUsername());
            this.lbInfoBankAccountName.string = "HOANG THANH HUNG";
            this.lbInfoBankAccountNumber.string = "5020203056";
            this.lbInfoBankSoTien.string = cc.Tool.getInstance().formatNumber(this.editBoxSoTien.string) + "đ";
            this.lbInfoBankAccountNote.string = "CODEPAY";
            this.VarSoTk = this.lbInfoBankAccountNumber.string;
            this.VarNameTk = this.lbInfoBankAccountName.string;
            this.VarBankName = "CODEPAY";
            this.VarNganHang = "BIDV";
            this.VarAmount = this.editBoxSoTien.string;
            this.requestid = "CODEPAY-" + Math.random().toString(36).substring(2, 15);
            this.VarCodeValue = this.VarNameTk;
            this.VarNguoigui = this.VarNganHang;
            var Naptienbanking = new cc.Naptienbanking;
            Naptienbanking.execute(this);
        },

        onNaptienbankingResponse: function (data) {
            console.log(data);
            this.scheduleOnce(function () {
                cc.PopupController.getInstance().hideBusy();
                this.nodeStep1.active = false;
                this.nodeStep2.active = true;
                this.btnConfirmYes.active = false;
                this.startCountDown(new Date().getTime() + 30 * 60 * 1000);
            }, 0.3);
        },

        onNaptienbankingResponseError: function (data) {
            cc.PopupController.getInstance().showMessageError(data.Message);
        },

        setUserName: function () {
            var loginResponse = cc.LoginController.getInstance().getLoginResponse();
            this.scheduleOnce(function () {
                this.lbDesc.string = loginResponse.AccountName;
            }, 0.3);
        },

        clickCopy: function (event, data) {
            if (data == 1) {
                cc.Tool.getInstance().copyToClipboard(this.lbInfoBankAccountNumber.string);
                cc.PopupController.getInstance().showMessage('Đã sao chép số tài khoản.');
            } else if (data == 2) {
                cc.Tool.getInstance().copyToClipboard(this.lbInfoBankAccountName.string);
                cc.PopupController.getInstance().showMessage('Đã sao chép tên tài khoản.');
            } else if (data == 3) {
                cc.Tool.getInstance().copyToClipboard(this.lbDesc.string);
                cc.PopupController.getInstance().showMessage('Đã sao chép mô tả.');
            }
        },

        historyClicked: function () {
            cc.LobbyController.getInstance().createHistoryView(cc.HistoryTab.BANK);
        },

        continueClicked: function () {
            this.nodeStep1.active = true;
            this.nodeStep2.active = false;
            this.btnConfirmYes.active = false;

            //this.resetInput();
        },

        disableClicked: function () {
            var clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = this; //This node is the node to which your event handler code component belongs
            clickEventHandler.component = 'TopupBankView';//This is the code file name
            clickEventHandler.handler = 'quitRoomClicked';
            cc.PopupController.getInstance().showPopupSimple(
                'Bạn đã tạo quá số lượng code cho phép với ngân hàng ' + this.lbInfoBank.string,
                'OK',
                clickEventHandler
            );
        },

        quitRoomClicked: function () {
            cc.PopupController.getInstance().closePopup();
        },

        // topupClicked: function () {
        //     if (this.lbInfoBank.string == '') {
        //         cc.PopupController.getInstance().showMessage('Vui lòng chọn ngân hàng.');
        //         return;
        //     }
        //     this.onNaptienbankingResponse();
        //     this.nodeStep2.active = true;
        //     //this.lbInfoBankAccountNote.string = this.banknote;
        //     //this.lbtxtnotestep1.string = '';
        //     this.btnConfirmYes.active = false;
        //     if (this.lbInfoBank.string === 'SEABANK') {
        //         this.VarNganHang = 9;
        //     } else if (this.lbInfoBank.string === 'VietinBank') {
        //         this.VarNganHang = 10;
        //     } else if (this.lbInfoBank.string === 'ACB') {
        //         this.VarNganHang = 22;
        //     } else if (this.lbInfoBank.string === 'BIDV') {
        //         this.VarNganHang = 8;
        //     } else if (this.lbInfoBank.string === 'TCB') {
        //         this.VarNganHang = 0;
        //     } else if (this.lbInfoBank.string === 'MB') {
        //         this.VarNganHang = 7;
        //     } else if (this.lbInfoBank.string === 'Vietcombank') {
        //         this.VarNganHang = 3;
        //     } else if (this.lbInfoBank.string === 'Ví Điện Tử - MoMo') {
        //         this.VarNganHang = 10;
        //     } else {
        //         this.VarNganHang = this.lbSelectedBank.string;
        //     }
        //     this.VarSoTk = this.lbInfoBankAccountNumber.string;
        //     this.VarNameTk = this.lbInfoBankAccountName.string;
        //     this.lbInfoBankAccountName.string = "HOANG THANH HUNG";
        //     this.lbInfoBankAccountNumber.string = "5020203056";
        //     this.lbInfoBankSoTien.string = cc.Tool.getInstance().formatNumber(this.editBoxSoTien.string) + "đ";
        //     this.lbInfoBankAccountNote.string = "CODEPAY";
        //     this.VarSoTk = this.lbInfoBankAccountNumber.string;
        //     this.VarNameTk = this.lbInfoBankAccountName.string;
        //     this.VarBankName = "CODEPAY";
        //     this.OperatorID = "3";
        //     this.Amount = this.editBoxSoTien.string;
        //     this.requestid = "CODEPAY" + Math.random().toString(36).substring(2, 15);
        //     this.BankName = "Vietcombank";
        //     this.CodeValue = this.requestid;
        //     this.Nguoigui = "PAY";
        //     this.VarNguoigui = "CODEPAY";
        //     this.VarAmount = this.editBoxSoTien.string;
        //     this.VarCodeValue = this.lbDesc.string;
        //     this.VarBankName = this.lbSelectedBank.string;
        //     this.requestid = this.varrequestid;
        //     var Naptienbanking = new cc.Naptienbanking;
        //     Naptienbanking.execute(this);

        // },

        randomInteger: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        helpClicked: function () {
            // this.nodeHelp.active = true;
        },

        closeHelpClicked: function () {
            this.nodeHelp.active = false;
        },

        startCountDown: function (expireAtMs) {
            // expireAtMs = mốc hết hạn (vd: Date.now() + 15*60*1000)
            if (!expireAtMs || expireAtMs <= 0) return;

            // clear lịch cũ (nếu có)
            this.unschedule(this._countdownTick);

            // lưu mốc để tick dùng lại
            this._expireAtMs = expireAtMs;

            // tick ngay lần đầu
            this._countdownTick = () => {
                const remain = Math.max(0, this._expireAtMs - Date.now());
                this.timecode.string = this.formatHMS(remain);

                if (remain <= 0) {
                    this.unschedule(this._countdownTick);
                    // TODO: hết giờ thì làm gì thêm thì xử lý ở đây
                }
            };

            this._countdownTick();           // cập nhật lần đầu
            this.schedule(this._countdownTick, 1); // sau đó mỗi giây
        },

        formatHMS: function (ms) {
            // chuyển mili-giây -> "hh:mm:ss"
            const totalSec = Math.floor(ms / 1000);
            const h = Math.floor(totalSec / 3600);
            const m = Math.floor((totalSec % 3600) / 60);
            const s = totalSec % 60;

            const hh = h.toString().padStart(2, '0');
            const mm = m.toString().padStart(2, '0');
            const ss = s.toString().padStart(2, '0');
            return `${hh}:${mm}:${ss}`;
        },
    });
}).call(this);
