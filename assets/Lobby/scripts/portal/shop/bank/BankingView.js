/**
 * Created by Nofear on 3/15/2019.
 */

var helper = require('Helper');
(function () {
    cc.BankingView = cc.Class({
        "extends": cc.Component,
        properties: {
            nodeStep1: cc.Node,
            toggleChooseValue: cc.Node,
            lbSelectedBank: cc.Label,
            animationMenuBank: cc.Animation,
            editBoxValue: cc.EditBox,
            editBoxtentk: cc.EditBox,
            editBoxnoidung: cc.EditBox,
            lbMoney: cc.Label,
            btnConfirm: cc.Button,
            lbInfoBank: cc.Label,
            lbInfoBankAccountNumber: cc.Label,
            lbInfoBankAccountName: cc.Label,
            lbInfoBankAccountNote: cc.Label,
            lbInfoBankAccountChiNhanh: cc.Label,

            toggleChoosePhuongThuc: cc.Node,
            lbSelectedPhuongThuc: cc.Label,
            listoptionbank: [cc.Node]
        },

        onLoad: function () {
            this.animOpenName = 'showDropdownMenu';
            this.animCloseName = 'hideDropdownMenu';
            this.getListTopupBank();
        },

        onEnable: function () {
            //  this.getCaptcha();
            this.resetInput();
            //3s click confirm 1 lan
            this.isTimerConfirm = false;
            this.timerConfirm = 0;
            this.timePerConfirm = 3;
            this.processTimeConfirm();
            this.nodeStep1.active = true;
            // this.nodeHelp.active = false;
            //this.listbank = {};

        },

        update: function (dt) {
            if (this.isTimerConfirm) {
                this.timerConfirm -= dt;

                this.processTimeConfirm();
            }
        },

        activateLogo: function (enabled) {
            this.nodeLogoUSDTs.forEach(function (nodeLogo) {
                nodeLogo.active = enabled;
            });
        },

        getListTopupBank: function () {
            var getListTopupBankCommand = new cc.GetListTopupBank1Command;
            getListTopupBankCommand.execute(this);
        },


        onGetListTopupBankResponse: function (response) {
            // console.log(response);
            cc.BankController.getInstance().setResponseTopupBanks(response);
            if (response.Type) {
                this.type = response.Type;
            }
            for (var i = 0; i < 9; i++) {
                this.listoptionbank[i].active = false;
            }
            this.listbanknapbank = response.Banks;
            for (var i = 0; i < this.listbanknapbank.length; i++) {
                var code = this.listbanknapbank[i].OperatorName;
                // console.log(code);
                if (code.includes('ACB')) {
                    this.listoptionbank[1].active = true;
                } else if (code.includes('BIDV')) {
                    this.listoptionbank[2].active = true;
                } else if (code.includes('VTB')) {
                    this.listoptionbank[6].active = true;
                } else if (code.includes('MB')) {
                    this.listoptionbank[7].active = true;
                } else if (code.includes('AGR')) {
                    this.listoptionbank[8].active = true;
                } else if (code.includes('VCB')) {
                    this.listoptionbank[0].active = true;
                } else if (code.includes('TCB')) {
                    this.listoptionbank[5].active = true;
                } else if (code.includes('Maritimebank')) {
                    // console.log('Maritimebank');
                    this.listoptionbank[9].active = true;
                } else if (code.includes('Vietcombank')) {
                    // console.log('Vietcombank');
                    this.listoptionbank[0].active = true;
                }
            }
        },

        onGetListTopupPhuongThucResponse: function () {

            this.toggleChoosePhuongThuc.resetListChooseValue();
            var self = this;
            var posY = -35;// Vi tri dau tien cua Item -> fix bug
            var index = 0;
            var list = ['Internet Banking', 'ATM', 'Quầy giao dịch'];
            list.forEach(function (res) {

                self.toggleChoosePhuongThuc.initializeToggleChooseValue(
                    self,
                    "BankingView",
                    "selectPhuongThucEvent",
                    res,
                    res,
                    posY
                );
                //if (index === 0) {
                //    self.setLBSelectedBank(bank);
                //}
                //index++;
                //Moi phan tu cac nhau 50 (do ko dung layout de fix bug)
                posY -= 50;
            })
        },

        choosebank: function (target, value) {
            this.lbSelectedBank.string = value;
            this.toggleChooseValue.active = false;
            console.log('Chọn ngân hàng:', value);
            var bankcode = '';
            if (value == 'Vietcombank') {
                bankcode = 'Vietcombank';
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
            } else if (value == 'Maritimebank') {
                bankcode = 'Maritimebank';
            }

            for (var i = 0; i < this.listbanknapbank.length; i++) {
                var code = this.listbanknapbank[i].OperatorName;
                // console.log('Chọn ngân hàng:', this.listbanknapbank[i], code);
                if (code.includes(bankcode)) {
                    console.log('Chọn ngân hàng:', this.listbanknapbank[i], bankcode);
                    this.banks = this.listbanknapbank[i];
                    // this.bankCode = this.listbanknapbank[i].code;
                    this.lbInfoBankAccountNumber.string = this.listbanknapbank[i].BankItems[0].BankNumber;
                    this.lbInfoBankAccountName.string = this.listbanknapbank[i].BankItems[0].BankName;
                    //var chargeBankCommand = new cc.ChargeBankCommand;
                    //chargeBankCommand.execute(this);
                }
            }
        },
        choosePT: function (target, value) {
            //  console.log(target);
            // console.log(value);
            this.lbSelectedPhuongThuc.string = value;
            this.toggleChoosePhuongThuc.active = false;
        },

        activeTimeConfirm: function () {
            this.isTimerConfirm = true;
            this.timerConfirm = this.timePerConfirm;
        },

        processTimeConfirm: function () {
            if (this.timerConfirm <= 0) {
                this.isTimerConfirm = false;
                this.btnConfirm.interactable = true;

                // this.lbConfirms.forEach(function (lbConfirm) {
                // lbConfirm.string = 'Lấy thông tin';
                // });
            } else {
                var self = this;
                var time = Math.round(self.timerConfirm);
                this.isTimerConfirm = true;
                this.btnConfirm.interactable = false;
                //   this.lbConfirms.forEach(function (lbConfirm) {
                //  lbConfirm.string = time;
                // });
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

        },

        getCaptcha: function () {
            var getCaptchaCommand = new cc.GetCaptchaCommand;
            getCaptchaCommand.execute(this);
        },

        setLBSelectedBank: function (bank) {
            this.lbSelectedBank.string = bank.name;
            this.banks = bank;
            this.bankCode = bank.code;
            //var chargeBankCommand = new cc.ChargeBankCommand;
            //chargeBankCommand.execute(this);
        },

        selectBank: function (value) {
            this.bankType = value;
        },

        onGetCaptchaResponse: function (response) {
            if (this.imageUrlCaptcha)
                this.imageUrlCaptcha.get('data:image/png;base64,' + cc.Tool.getInstance().removeStr(response[1], '\r\n'));
        },

        onChargeBankResponse: function (response) {
            if (response) {
                var orders = response.Orders;
                this.orders = orders;
                this.banks = orders.List;
                this.editBoxnoidung.string = orders.List.code;
                this.lbInfoBankAccountNumber.string = orders.List.phoneNum;
                this.lbInfoBankAccountName.string = orders.List.phoneName;
                this.lbInfoBankAccountNote.string = orders.List.redirect;
                this.lbInfoBankAccountChiNhanh.string = orders.List.bank_provider;
                this.varrequestid = orders.List.id;
                var macode = helper.randomStringABC(5);
                var name = cc.LoginController.getInstance().getLoginResponse();
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
            if (this.lbInfoBankAccountNumber && cc.Tool.getInstance().copyToClipboard(this.lbInfoBankAccountNumber.string)) {
                cc.PopupController.getInstance().showMessage('Đã sao chép số tài khoản.');
            }
        },

        copyBankAccountNameClicked: function () {
            if (this.lbInfoBankAccountName && cc.Tool.getInstance().copyToClipboard(this.lbInfoBankAccountName.string)) {
                cc.PopupController.getInstance().showMessage('Đã sao chép tên tài khoản.');
            }
        },

        copyMoneyValueClicked: function () {

        },

        copyTranIDClicked: function () {

            if (this.banks != null && cc.Tool.getInstance().copyToClipboard(this.lbInfoTranID.string)) {
                cc.PopupController.getInstance().showMessage('Đã sao chép nội dung chuyển khoản.');
            }
        },

        onEditingValueChanged: function (target) {
            this.editBoxValue.string = this.formatToCurrency(target);
        },

        onEditingValueDidEnd: function (target) {
        },
        formatToCurrency: function (amount) {
            return String(amount).replace(/(.)(?=(\d{3})+$)/g, '$1,');
        },

        openMenuBankClicked: function () {
            this.toggleChooseValue.active = !this.toggleChooseValue.active;
        },

        openMenuPhuongthucClicked: function () {
            this.toggleChoosePhuongThuc.active = !this.toggleChoosePhuongThuc.active;
        },

        hideMenuBankClicked: function () {
            this.animationMenuBank.play(this.animCloseName);
        },

        hideMenuPhuongThucClicked: function () {
            this.animationMenuBank.play(this.animCloseName);
        },

        selectBankEvent: function (event, data) {
            this.bankCode = data.bankCode;
            this.selectBank(data.BankName);
            this.setLBSelectedBank(data);
            this.animationMenuBank.play(this.animCloseName);

        },

        selectPhuongThucEvent: function (event, data) {
            this.setLBSelectedPhuongthuc(data);
            this.animationMenuPhuongThuc.play(this.animCloseName);

        },
        setLBSelectedPhuongthuc: function (txt) {
            this.lbSelectedPhuongThuc.string = txt;
        },

        choosePhuongThucClicked: function (event, data) {

            this.setLBSelectedPhuongthuc(data.toString());
        },

        chooseBankClicked: function (event, data) {
            this.selectBank(data.toString());
            this.setLBSelectedBank(data.toString());
        },

        refreshCaptchaClicked: function () {
            this.getCaptcha();
        },

        historyClicked: function () {
            cc.LobbyController.getInstance().createHistoryView(cc.HistoryTab.BANK);
        },

        continueClicked: function () {
            this.nodeStep1.active = true;
            this.nodeStep2.active = false;
            //this.resetInput();
        },

        topupClicked: function () {


            //let amount = cc.Tool.getInstance().removeDot(this.editBoxValue.string);
            this.amount = cc.Tool.getInstance().removeDot(this.editBoxValue.string);

            if (this.lbInfoBank.string === '') {
                cc.PopupController.getInstance().showMessage('Vui lòng chọn ngân hàng.');
                return;
            }
            if (this.editBoxValue.string === '') {
                cc.PopupController.getInstance().showMessage('Vui lòng nhập số tiền muốn nạp.');
                return;
            }

            if (this.editBoxtentk === '') {
                cc.PopupController.getInstance().showMessage('Vui lòng nhập tên người gửi.');
                return;
            }
            if (this.lbInfoBankAccountNote === '') {
                cc.PopupController.getInstance().showMessage('Vui lòng nhập nội dung chuyển tiền.');
                return;
            }

            if (this.amount > this.max) {
                cc.PopupController.getInstance().showMessage('Số tiền nạp tối đa là ' + cc.Tool.getInstance().formatNumber(this.max) + ' đ');
                return;
            }

            if (this.amount < this.min) {
                cc.PopupController.getInstance().showMessage('Số tiền nạp tối thiểu là ' + cc.Tool.getInstance().formatNumber(this.min) + ' đ');
                return;
            }


            if (this.lbInfoBank.string === 'SEABANK') {
                this.VarNganHang = 9;
            } else if (this.lbInfoBank.string === 'VietinBank') {
                this.VarNganHang = 10;
            } else if (this.lbInfoBank.string === 'ACB') {
                this.VarNganHang = 22;
            } else if (this.lbInfoBank.string === 'BIDV') {
                this.VarNganHang = 8;
            } else if (this.lbInfoBank.string === 'MB') {
                this.VarNganHang = 7;
            } else if (this.lbInfoBank.string === 'Vietcombank') {
                this.VarNganHang = 3;
            } else if (this.lbInfoBank.string === 'Ví Điện Tử - MoMo') {
                this.VarNganHang = 10;
            } else {
                this.VarNganHang = this.lbSelectedBank.string;
            }


            this.VarSoTk = this.lbInfoBankAccountNumber.string;
            this.VarNameTk = this.lbInfoBankAccountName.string;

            this.VarNguoigui = this.editBoxtentk.string;
            this.VarAmount = helper.getOnlyNumberInString(this.editBoxValue.string);
            this.VarCodeValue = this.lbInfoBankAccountNote.string;
            this.VarBankName = this.lbSelectedBank.string;
            this.requestid = this.varrequestid;
            var Naptienbanking = new cc.Naptienbanking;
            Naptienbanking.execute(this);
            this.activeTimeConfirm();
        },
        randomInteger: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        onNaptienbankingResponse: function (data) {

            var clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = this; //This node is the node to which your event handler code component belongs
            clickEventHandler.component = 'BankingView';//This is the code file name
            clickEventHandler.handler = 'quitRoomClicked';
            cc.PopupController.getInstance().showPopupSimple(
                'Đã tạo phiếu nạp thành công, nhân viên sẽ xác nhận trong vòng 5 phút',
                'OK',
                clickEventHandler
            );

            //cc.PopupController.getInstance().showPopupSimple("Thành công","Thông báo",this.openhistory());
        },
        quitRoomClicked: function () {
            cc.ShopController.getInstance().clicklichsugiaodich();
            this.closePopup();
        },

        closePopup: function () {
            cc.PopupController.getInstance().closePopup();
        },


        onNaptienbankingResponseError: function (data) {
            cc.PopupController.getInstance().showMessageError(data.Message);
        },
        helpClicked: function () {
            // this.nodeHelp.active = true;
        },

        closeHelpClicked: function () {
            this.nodeHelp.active = false;
        },
    });
}).call(this);
