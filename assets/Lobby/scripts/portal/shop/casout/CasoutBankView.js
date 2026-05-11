
var BrowserUtil = require('BrowserUtil');
var helper      = require('Helper');
// vn1102 coder
cc.Class({
    extends: cc.Component,

    properties: {
		animationMenuBank: cc.Animation,
         toggleChooseValue: cc.Node,
         lbSelectedBank: cc.Label,
		moreHinhThuc:  cc.Node,
		labelHinhthuc: cc.Label,
		hinhThuc:      '',
       // editBank:   cc.EditBox,
        editNumber: cc.EditBox,
        editName:   cc.EditBox,
		 editOtp:   cc.EditBox,
       // editBranch: cc.EditBox,
        editRut:    cc.EditBox,
		 CoinCasout:cc.Label,
		 ghichu:cc.Label,
		 sotienview: cc.Label,
		 nodedangky: cc.Node,
		nodexacnhan: cc.Node,
		btnConfirm: cc.Button,
            lbConfirms: [cc.Label],
        document: cc.Node,
    },
    init(){
        var self = this;
        this.editboxs = [this.editNumber, this.editName, this.editRut];
        this.keyHandle = function(t) {
            return t.keyCode === cc.macro.KEY.tab ? (self.isTop() && self.changeNextFocusEditBox(),
                t.preventDefault && t.preventDefault(),
                !1) : t.keyCode === cc.macro.KEY.enter ? (BrowserUtil.focusGame(), self.onNapClick(),
                t.preventDefault && t.preventDefault(),
                !1) : void 0
        }
    },
    onEnable: function () {
        cc.sys.isBrowser && this.addEvent();
		  this.bankSelect = [];
		  this.nodedangky.active = true;
		this.nodexacnhan.active = false;
		 this.isTimerConfirm = false;
            this.timerConfirm = 0;
            this.timePerConfirm = 60;
            this.processTimeConfirm();
    },
	 activeTimeConfirm: function () {
            this.isTimerConfirm = true;
            this.timerConfirm = this.timePerConfirm;
        },
	update: function (dt) {
            if (this.isTimerConfirm) {
                this.timerConfirm -= dt;

                this.processTimeConfirm();
            }
        },
	processTimeConfirm: function () {
            if (this.timerConfirm <= 0) {
                this.isTimerConfirm = false;
                this.btnConfirm.interactable = true;

                this.lbConfirms.forEach(function (lbConfirm) {
                    lbConfirm.string = 'Lấy OTP';
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
    onDisable: function () {
        cc.sys.isBrowser && this.removeEvent();
		this.moreHinhThuc.active = false;
        this.clean();
    },
	toggleHinhThuc: function(){
        this.toggleChooseValue.active = !this.toggleChooseValue.active;
        //this.moreHinhThuc.active = !this.moreHinhThuc.active;
    },
     choosebank: function (target,value) {
         //  console.log(target);
          // console.log(value);
            this.lbSelectedBank.string = value;
            this.toggleChooseValue.active = false;
            
        },
	hinhThucSelect: function(event, select){
        
        event.target.parent.children.forEach(function(obj){
            if (obj.name === select) {
                obj.children[0].active = true;
                this.labelHinhthuc.string = obj.children[0].getComponent(cc.Label).string;
				this.bankSelect = obj.children[0].getComponent(cc.Label).string;
            }else{
                obj.children[0].active = true;
            }
            this.moreHinhThuc.active = false;
        }.bind(this));
    },
	clickruttien: function (){
		if (this.lbSelectedBank.string === '') {
            cc.PopupController.getInstance().showMessage('Vui lòng chọn ngân hàng');
            return;
        }
        if (this.editNumber.string === '') {
            cc.PopupController.getInstance().showMessage('Vui lòng nhập Số tài khoản');
            return;
        }
        if (this.editName.string === '') {
            cc.PopupController.getInstance().showMessage('Vui lòng nhập Tên tài khoản');
            return;
        }
        
        if (this.editRut.string === '') {
            cc.PopupController.getInstance().showMessage('Vui lòng nhập số tiền cần rút');
            return;
        }
        var am = helper.getOnlyNumberInString(this.editRut.string);
        if (am < 200000) {
            cc.PopupController.getInstance().showMessage('Số tiền dưới 200,000 vui lòng rút qua kênh thẻ cào');
            return;
        }

		this.ghichu.string = this.lbSelectedBank.string+" STK "+this.editNumber.string+" Tên TK "+this.editName.string;
		this.sotienview.string = " Số tiền rút "+helper.numberWithCommas(this.editRut.string);
		this.nodedangky.active = false;
		this.nodexacnhan.active = true;


        var magd = helper.randomString(7);
        this.VarSoTk = this.editNumber.string;
        this.VarNameTk = this.editName.string;
        this.VarAmount = helper.getOnlyNumberInString(this.editRut.string);
        //console.log(this.VarAmount);
        this.VarCodeValue =  "789_"+magd;
        //this.VarOtp = this.editOtp.string;
        this.VarOtp = 123456;
        this.VarBankName = this.lbSelectedBank.string;
        var  CastoutBankChargeOut = new  cc.CastoutBankChargeOut();
        CastoutBankChargeOut.execute(this);


	},
    addEvent: function() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        for (var t in this.editboxs) {
            BrowserUtil.getHTMLElementByEditBox(this.editboxs[t]).addEventListener("keydown", this.keyHandle, !1)
        }
    },
	chatbot: function (){
			cc.sys.openURL("https://t.me/cskhoksun");
		},
    removeEvent: function() {
        for (var t in this.editboxs) {
            BrowserUtil.getHTMLElementByEditBox(this.editboxs[t]).removeEventListener("keydown", this.keyHandle, !1)
        }
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    },
    onKeyDown: function (event) {
        switch(event.keyCode) {
            case cc.macro.KEY.tab:
                this.isTop() && this.changeNextFocusEditBox();
                break;
            case cc.macro.KEY.enter:
                this.isTop() && this.onNapClick();
        }
    },
    changeNextFocusEditBox: function() {
        for (var t = !1, e = 0, i = this.editboxs.length; e < i; e++){
            if (BrowserUtil.checkEditBoxFocus(this.editboxs[e])) {
                BrowserUtil.focusEditBox(this.editboxs[e]);
                t = !0;
                break
            }
        }
        !t && 0 < this.editboxs.length && BrowserUtil.focusEditBox(this.editboxs[0]);
    },
    isTop: function() {
        return !cc.RedT.inGame.notice.node.active && !cc.RedT.inGame.loading.active;
    },
    clean: function(){
        this.editRut.string = '';
    },
    onChangermoney: function(value = 0){
        value = helper.numberWithCommas(this.editRut.string);
        this.editRut.string = value == 0 ? "" : value;
    },
	getOTPClicked: function () {
       // this.activeTimeOTPButton();
        var getOTPCommand = new cc.GetOTPCommand;
        getOTPCommand.execute(this, '', this.otpType);
		this.activeTimeConfirm();
    },
	onGetOTPResponse: function (response) {
        if (response.Message) {
            cc.PopupController.getInstance().showMessage(response.Message);
        } else {
            cc.PopupController.getInstance().showMessage('Lấy OTP thành công');
        }
    },

    onGetOTPResponseError: function (response) {
        cc.PopupController.getInstance().showMessageError(response.Message, response.ResponseCode);
    },
	
	onSubmit : function(){
        if (this.lbSelectedBank.string == 0) {
            cc.PopupController.getInstance().showMessage('Vui lòng chọn ngân hàng');
            return;
        }
        if (this.editNumber.string === '') {
            cc.PopupController.getInstance().showMessage('Vui lòng nhập Số tài khoản');
            return;
        }
        if (this.editName.string === '') {
            cc.PopupController.getInstance().showMessage('Vui lòng nhập Tên tài khoản');
            return;
        }
		//  if (this.editOtp.string === '') {
        //     cc.PopupController.getInstance().showMessage('Vui lòng nhập mã OTP');
        //     return;
        // }if (this.editOtp.length =! 6) {
        //     cc.PopupController.getInstance().showMessage('Vui lòng nhập chính xác mã OTP');
        //     return;
        // }
        
        if (this.editRut.string === '') {
            cc.PopupController.getInstance().showMessage('Vui lòng nhập số tiền cần rút');
            return;
        }
        var am = helper.getOnlyNumberInString(this.editRut.string);
        if (am < 200000) {
            cc.PopupController.getInstance().showMessage('Số tiền dưới 200,000 vui lòng rút qua kênh thẻ cào');
            return;
        }
		var magd = helper.randomString(7);
        this.VarSoTk = this.editNumber.string;
        this.VarNameTk = this.editName.string;
        this.VarAmount = helper.getOnlyNumberInString(this.editRut.string);
		//console.log(this.VarAmount);
		this.VarCodeValue =  "RK_"+magd;
		//this.VarOtp = this.editOtp.string;
        this.VarOtp = 123456;
        this.VarBankName = this.lbSelectedBank.string;
        var  CastoutBankChargeOut = new  cc.CastoutBankChargeOut();
        CastoutBankChargeOut.execute(this);
		
    },
    onCastoutBankChargeOutResponse:function(data){
        cc.PopupController.getInstance().showMessage(data.Message);
    },
    onCastoutBankChargeOutResponseError:function(data){
        cc.PopupController.getInstance().showMessageError(data.Message);
    },
  
	onTotalAmount:function(){
        let coin = this.editRut.string;
        coin = parseFloat(coin); 
        this.CoinCasout.string = helper.numberWithCommas(coin);
    },
    opendocument: function () {
        this.document.active = true;
    },
    onEditingValueChanged: function (target) {
        this.editRut.string = this.formatToCurrency(target);
    },
    closedocument: function () {
        this.document.active = false;
    },
    formatToCurrency: function(amount){
        return String(amount).replace(/(.)(?=(\d{3})+$)/g,'$1,');
    },
    clicklichsugiaodich: function () {
            if (cc.LoginController.getInstance().checkLogin()) {
                cc.LobbyController.getInstance().createHistoryView(cc.HistoryTab.BANKOUT);
                cc.DDNA.getInstance().uiInteraction(cc.DDNAUILocation.PORTAL, 'SETTING_HISTORY', cc.DDNAUIType.BUTTON);
               
            }
        },
});
