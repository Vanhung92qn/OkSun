/**
 * Created by Nofear on 3/15/2019.
 */

var helper = require('Helper');
var shopConfig = require('ShopConfig');
(function () {
    cc.Bank1PayView = cc.Class({
        "extends": cc.Component,
        properties: {
            nodeStep1: cc.Node,
            nodeStep2: cc.Node,
            toggleChooseValue: cc.Node,
            lbSelectedBank: cc.Label,
            animationMenuBank: cc.Animation,
            editBoxValue: cc.EditBox,

            lbstep2title: cc.Label,
            lbstep2money: cc.Label,
            editBoxPass: cc.EditBox,
            listlogo: [cc.Node],
        },

        onLoad: function () {
            this.animOpenName = 'showDropdownMenu';
            this.animCloseName = 'hideDropdownMenu';
            //this.getListTopupBank();
            this.toggleChooseValue.active = false;
        },

        onEnable: function () {
            this.nodeStep1.active = true;
            this.nodeStep2.active = false;
            for (var i = 0; i <= 6; i++) {
                this.listlogo[i].active = false;
            }
            this.checkbank();
        },

        update: function (dt) {
        },

        activateLogo: function (enabled) {
            this.nodeLogoUSDTs.forEach(function (nodeLogo) {
               nodeLogo.active = enabled;
            });
        },

        getListTopupBank: function () {
            this.onGetListTopupBankResponse();
        },
		

        onGetListTopupBankResponse: function () {
           
            this.toggleChooseValue.resetListChooseValue();
            var self = this;
            var posY = -35;// Vi tri dau tien cua Item -> fix bug
            var index = 0;
            var list = ['Vietcombank','ACB','BIDV','DongA','Sacombank','Techcombank','Vietinbank','Agribank'];
            list.forEach(function (res) {
               
                self.toggleChooseValue.initializeToggleChooseValue(
                    self,
                    "Bank1PayView",
                    "selectBankOnePayEvent",
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

        choosebank: function (target,value) {
         //  console.log(target);
          // console.log(value);
           this.lbSelectedBank.string = value;
           this.toggleChooseValue.active = false;
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

            this.lbSelectedBank.string = bank;
        },

        selectBank: function (value) {
            this.bankType = value;
        },

        onGetCaptchaResponse: function (response) {
            if (this.imageUrlCaptcha)
                this.imageUrlCaptcha.get('data:image/png;base64,' + cc.Tool.getInstance().removeStr(response[1], '\r\n'));
        },

        onChargeBankResponse: function (response) {
			if(response != null){
                var orders = response.Orders;
                this.orders = orders;
                this.banks = orders.List;
                
                this.lbInfoBankAccountNumber.string = orders.List.phoneNum;
                this.lbInfoBankAccountName.string = orders.List.phoneName;
                this.lbInfoBankAccountNote.string = orders.List.redirect;
                this.lbInfoBankAccountChiNhanh.string = orders.List.bank_provider;

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
            if(this.banks != null && cc.Tool.getInstance().copyToClipboard(this.banks.phoneNum)) {
                cc.PopupController.getInstance().showMessage('Đã sao chép số tài khoản.');
            }
        },

        copyBankAccountNameClicked: function () {
            if(this.banks != null && cc.Tool.getInstance().copyToClipboard(this.banks.phoneName)) {
                cc.PopupController.getInstance().showMessage('Đã sao chép tên tài khoản.');
            }
        },

        copyMoneyValueClicked: function () {

        },

        copyTranIDClicked: function () {
			
            if(this.banks != null && cc.Tool.getInstance().copyToClipboard(this.lbInfoTranID.string)) {
                cc.PopupController.getInstance().showMessage('Đã sao chép nội dung chuyển khoản.');
            }
        },

        onEditingValueChanged: function (target) {
            this.editBoxValue.string = this.formatToCurrency(target);
        },

        onEditingValueDidEnd: function () {
           
        },

        formatToCurrency: function(amount){
            return String(amount).replace(/(.)(?=(\d{3})+$)/g,'$1,');
        },
        onEditingPassChanged: function (txt) {
            var text = "";
            for (var i = txt.length - 1; i >= 0; i--) {
                text += "*";
            }
            this.editBoxPass.string = text;
            console.log(text);
        },

        onEditingPassDidEnd: function () {
           
        },


        openMenuBankClicked: function () {
            this.toggleChooseValue.active = !this.toggleChooseValue.active;
        },

        openMenuPhuongthucClicked: function () {
        },

        hideMenuBankClicked: function () {
            this.animationMenuBank.play(this.animCloseName);
        },

         hideMenuPhuongThucClicked: function () {
            this.animationMenuBank.play(this.animCloseName);
        },

        selectBankOnePayEvent: function(event, data) {

			this.lbSelectedBank.string = data;
            this.animationMenuBank.play(this.animCloseName);
			
        },

        selectPhuongThucEvent: function(event, data) {
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
            this.amount = cc.Tool.getInstance().removeDot(this.editBoxValue.string);


            if (this.lbSelectedBank.string === '') {
                cc.PopupController.getInstance().showMessage('Vui lòng chọn ngân hàng.');
                return;
            }
            if (this.editBoxValue.string === '') {
                cc.PopupController.getInstance().showMessage('Vui lòng nhập số tiền muốn nạp.');
                return;
            }
             if(this.amount < 50000){
                cc.PopupController.getInstance().showMessage('Yêu cầu giao dịch tổi thiểu 50,000 VNĐ');
                return;
            }
            
            this.lbstep2title.string = "Vui lòng nhập thông tin đăng nhập\n"+this.lbSelectedBank.string+" của bạn";
            this.lbstep2money.string = "Thực hiện giao dịch số tiền: " +this.formatToCurrency(this.amount) + " VNĐ";

            var indexlogo = 0;
            if(this.lbSelectedBank.string == 'Vietcombank'){
                indexlogo = 0;
            }else if(this.lbSelectedBank.string == 'ACB'){
                indexlogo = 1;
            }else if(this.lbSelectedBank.string == 'BIDV'){
                indexlogo = 2;
            }else if(this.lbSelectedBank.string == 'DongA'){
                indexlogo = 3;
            }else if(this.lbSelectedBank.string == 'Sacombank'){
                indexlogo = 4;
            }else if(this.lbSelectedBank.string == 'Techcombank'){
                indexlogo = 5;
            }else if(this.lbSelectedBank.string == 'Vietinbank'){
                indexlogo = 6;
            }else if(this.lbSelectedBank.string == 'Agribank'){
                indexlogo = 7;
            }
            this.listlogo[indexlogo].active = true;
            

            this.nodeStep1.active = false;
			this.nodeStep2.active = true;
            shopConfig.onepaycheck = 1;
            shopConfig.onepayamount = this.amount;
            shopConfig.onepaybank = this.lbSelectedBank.string;

        },
        checkbank: function () {
            let datacodepay = shopConfig.datacodepay;
            if(shopConfig.onepaycheck == 1){
                this.lbstep2title.string = "Vui lòng nhập thông tin đăng nhập\n"+shopConfig.onepaybank+" của bạn";
                this.lbstep2money.string = this.formatToCurrency(shopConfig.onepayamount);

                var indexlogo = 0;
                if(shopConfig.onepaybank == 'Vietcombank'){
                    indexlogo = 0;
                }else if(shopConfig.onepaybank == 'ACB'){
                    indexlogo = 1;
                }else if(shopConfig.onepaybank == 'BIDV'){
                    indexlogo = 2;
                }else if(shopConfig.onepaybank == 'DongA'){
                    indexlogo = 3;
                }else if(shopConfig.onepaybank == 'Sacombank'){
                    indexlogo = 4;
                }else if(shopConfig.onepaybank == 'Techcombank'){
                    indexlogo = 5;
                }else if(shopConfig.onepaybank == 'Vietinbank'){
                    indexlogo = 6;
                }else if(shopConfig.onepaybank == 'Agribank'){
                    indexlogo = 7;
                }
                this.listlogo[indexlogo].active = true;
                this.nodeStep1.active = false;
                this.nodeStep2.active = true;
            }
        },

        topupClickednap: function () {

            shopConfig.onepaycheck = 0;
            shopConfig.onepayamount = 0;
            shopConfig.onepaybank = '';
           // cc.PopupController.getInstance().showMessageError("Hệ thống đang bảo trì. Vui lòng quay lại sau");
             var clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = this; //This node is the node to which your event handler code component belongs
            clickEventHandler.component = 'Bank1PayView';//This is the code file name
            clickEventHandler.handler = 'quitPopupClicked';
            cc.PopupController.getInstance().showPopupSimple(
                'Chúng tôi đang nâng cấp ngân hàng này. Vui lòng quay lại sau.',
                'OK',
                clickEventHandler
            );


        },

        
        quitPopupClicked: function () {
           cc.PopupController.getInstance().closePopup();
        },
        topupClickedback: function () {
            this.nodeStep1.active = true;
            this.nodeStep2.active = false;
            shopConfig.onepaycheck = 0;
            shopConfig.onepayamount = 0;
            shopConfig.onepaybank = '';
        },

    onNaptienbankingResponse:function(data){

         var clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = this; //This node is the node to which your event handler code component belongs
            clickEventHandler.component = 'Bank1PayView';//This is the code file name
            clickEventHandler.handler = 'quitRoomClicked';
            cc.PopupController.getInstance().showPopupSimple(
                'Thành công',
                'Đồng ý',
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

   
    onNaptienbankingResponseError:function(data){
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
