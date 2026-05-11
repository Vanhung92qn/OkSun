
var BrowserUtil = require('BrowserUtil');
var helper      = require('Helper');
cc.Class({
    extends: cc.Component,
    properties: {
        editAddress:    cc.EditBox,
        editRut:    cc.EditBox,
        document: cc.Node,
        documentTygia: cc.Node,
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
     onEditingValueChanged: function (target) {
        this.editRut.string = this.formatToCurrency(target);
    },
    actsubmit:function(){
            if(this.editAddress.string == ''){
                cc.PopupController.getInstance().showMessage('Vui lòng nhập địa chỉ ví');
                return;
            }
              if(this.editRut.string == ''){
                cc.PopupController.getInstance().showMessage('Vui lòng nhập số tiền rút');
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
         openhdTygia: function () {
            this.documentTygia.active = !this.documentTygia.active;
            
        },
});
