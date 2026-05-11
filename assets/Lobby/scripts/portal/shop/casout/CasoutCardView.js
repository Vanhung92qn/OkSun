
var BrowserUtil = require('BrowserUtil');
var helper      = require('Helper');
(function () {
    cc.CashoutCardView = cc.Class({
        "extends": cc.Component,
        properties: {
    		moreCardType:  cc.Node,
    		labelHinhthuc: cc.Label,
    		btnViettel:      cc.Button,
            btnMobifone:   cc.Button,
            btnVina: cc.Button,
            btnVNMB: cc.Button,
            toogleCardValue: cc.Node,
            toogleCardValueVms: cc.Node,
            toogleCardValueVnp: cc.Node,
            toogleCardValueVnmb: cc.Node,
            document: cc.Node,

        },
        init(){
            var self = this;
        },
        onEnable: function () {
            this.cardtype = 'VIETTEL';
        },
        onDisable: function () {
            cc.sys.isBrowser && this.removeEvent();
        },
        selectCard: function (cardType,target) {
            this.btnViettel.interactable = true;
            this.btnMobifone.interactable = true;
            this.btnVina.interactable = true;
            this.btnVNMB.interactable = true;
            switch (target) {
                case 'VIETTEL':
                    this.btnViettel.interactable = false;
                    this.cardtype = 'VIETTEL';
                    break;
                case 'MOBIFONE':
                    this.btnMobifone.interactable = false;
                    this.cardtype = 'MOBIFONE';
                break;
                case 'VINAPHONE':
                    this.btnVina.interactable = false;
                    this.cardtype = 'VINAPHONE';
                    break;
                case 'VIETNAMOBILE':
                    //cc.PopupController.getInstance().showMessage('Nhà mạng đang bảo trì');
                    this.btnVNMB.interactable = false;
                    this.cardtype = 'VIETNAMOBILE';
                    break;
            }
        },
        openMenuCardValueClicked: function () {
            if(this.cardtype == 'VIETTEL'){
                this.toogleCardValue.active = !this.toogleCardValue.active;
            }else if(this.cardtype == 'MOBIFONE'){
                this.toogleCardValueVms.active = !this.toogleCardValueVms.active;
            }else if(this.cardtype == 'VINAPHONE'){
                this.toogleCardValueVnp.active = !this.toogleCardValueVnp.active;
            }else if(this.cardtype == 'VIETNAMOBILE'){
                this.toogleCardValueVnmb.active = !this.toogleCardValueVnmb.active;
            }
            
        },
        cardvalueSelect: function(event, select){
            
            event.target.parent.children.forEach(function(obj){
                if (obj.name === select) {
                    obj.children[0].active = true;
                    this.labelHinhthuc.string = obj.children[0].getComponent(cc.Label).string;
                }else{
                    obj.children[0].active = true;
                }
                this.toogleCardValue.active = false;
            }.bind(this));
        },

        cardvalueSelectVMS: function(event, select){
            
            event.target.parent.children.forEach(function(obj){
                if (obj.name === select) {
                    obj.children[0].active = true;
                    this.labelHinhthuc.string = obj.children[0].getComponent(cc.Label).string;
                }else{
                    obj.children[0].active = true;
                }
                this.toogleCardValueVms.active = false;
            }.bind(this));
        },
        cardvalueSelectVNP: function(event, select){
            
            event.target.parent.children.forEach(function(obj){
                if (obj.name === select) {
                    obj.children[0].active = true;
                    this.labelHinhthuc.string = obj.children[0].getComponent(cc.Label).string;
                }else{
                    obj.children[0].active = true;
                }
                this.toogleCardValueVnp.active = false;
            }.bind(this));
        },

    	cardvalueSelectVNMB: function(event, select){
            
            event.target.parent.children.forEach(function(obj){
                if (obj.name === select) {
                    obj.children[0].active = true;
                    this.labelHinhthuc.string = obj.children[0].getComponent(cc.Label).string;
                }else{
                    obj.children[0].active = true;
                }
                this.toogleCardValueVnmb.active = false;
            }.bind(this));
        },
        opendocument: function () {
            this.document.active = true;
        },
        closedocument: function () {
            this.document.active = false;
        },
        formatToCurrency: function(amount){
            return String(amount).replace(/(.)(?=(\d{3})+$)/g,'$1,');
        },
        addEvent: function() {
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
            for (var t in this.editboxs) {
                BrowserUtil.getHTMLElementByEditBox(this.editboxs[t]).addEventListener("keydown", this.keyHandle, !1)
            }
        },
        removeEvent: function() {
            for (var t in this.editboxs) {
                BrowserUtil.getHTMLElementByEditBox(this.editboxs[t]).removeEventListener("keydown", this.keyHandle, !1)
            }
            cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        },

        actsubmit:function(){
            if(this.labelHinhthuc.string == '' || this.labelHinhthuc.string =='Chọn mệnh giá thẻ'){
                cc.PopupController.getInstance().showMessage('Vui lòng chọn mệnh giá');
                return;
            }
            cc.PopupController.getInstance().showMessage('Hình thức đang bảo trì. Vui lòng thử lại sau');
             // var clickEventHandler = new cc.Component.EventHandler();
             //    clickEventHandler.target = this; //This node is the node to which your event handler code component belongs
             //    clickEventHandler.component = 'CashoutCardView';//This is the code file name
             //    clickEventHandler.handler = 'quitRoomClicked';
             //    cc.PopupController.getInstance().showPopupSimple(
             //        'Hình thức đang bảo trì. Vui lòng thử lại sau',
             //        'OK',
             //        clickEventHandler
             //    );

            //cc.PopupController.getInstance().showPopupSimple("Thành công","Thông báo",this.openhistory());
        },
        quitRoomClicked: function () {
           cc.PopupController.getInstance().closePopup();
        },
         clicklichsugiaodich: function () {
            if (cc.LoginController.getInstance().checkLogin()) {
                cc.LobbyController.getInstance().createHistoryView(cc.HistoryTab.CARDOUT);
                cc.DDNA.getInstance().uiInteraction(cc.DDNAUILocation.PORTAL, 'SETTING_HISTORY', cc.DDNAUIType.BUTTON);
               
            }
        },
    });
}).call(this);