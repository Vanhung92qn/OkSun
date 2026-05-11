// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {

        nodeCoin: cc.Node,
        nodeBank: cc.Node,
        nodeCard: cc.Node,
        nodeMomo: cc.Node,
        nodeTabTopup: cc.Button,
        nodeTabBank: cc.Button,
       // nodeTabMomo: cc.Button,
        nodeTabCoin: cc.Button,
        nodeBusy: cc.Node,
    },

    onLoad: function () {
        //cc.ShopTab.MOMO cc.ShopTab.TOPUP
        cc.ShopCastOutControler.getInstance().setShopCastOutView(this);
        this.nodeTabActive = this.nodeBank;
        this.currentTab = cc.ShopTab.BANK;
        this.node.zIndex = cc.NoteDepth.POPUP_PORTAL;
        this.animation = this.node.getComponent(cc.Animation);
        this.nodeBank.active = true;
        this.nodeCoin.active = false;
        this.nodeCard.active = false;
        this.bankName = "";
        
        
      //  this.init();
        // this.nodeTabTopup.active = true;
        // this.nodeTabBank.active = true;
        // this.nodeTabMomo.active = true;
        // this.nodeTabTransfer.active = true;
    },
    start: function(){
        this.bankSelect = [];
    },
    onEnable: function () {
       this.animation.play('openPopup');
        var startTab = 'BANK';
        var self = this;

        cc.director.getScheduler().schedule(function () {
            self.activeTopupTab(startTab);
        }, this, 0, 0, 0.3, false);
    },
    changeTabBaoTri: function () {
       cc.PopupController.getInstance().showMessageError('Phương thức đang bảo trì. Vui lòng quay lại sau');
    },
    changeTabClicked: function (event, data) {
       if (data.toString() === this.currentTab) return;
          this.activeTopupTab(data.toString());

        cc.DDNA.getInstance().uiInteraction(cc.DDNAUILocation.SHOP, data.toString(), cc.DDNAUIType.BUTTON);
    },
	 clicklichsugiaodich: function () {
            if (cc.LoginController.getInstance().checkLogin()) {
                cc.LobbyController.getInstance().createHistoryView(cc.HistoryTab.BANK);
                cc.DDNA.getInstance().uiInteraction(cc.DDNAUILocation.PORTAL, 'SETTING_HISTORY', cc.DDNAUIType.BUTTON);
               
            }
        },
  clicklichsutranfer: function () {
            if (cc.LoginController.getInstance().checkLogin()) {
                cc.LobbyController.getInstance().createHistoryView(cc.HistoryTab.RECEIVE);
                cc.DDNA.getInstance().uiInteraction(cc.DDNAUILocation.PORTAL, 'SETTING_HISTORY', cc.DDNAUIType.BUTTON);
               
            }
        },
    activeTopupTab(tabName, nickName) {
        this.nodeTabActive.active = false;

        this.nodeTabTopup.node.getChildByName("act").getComponent(cc.Sprite).node.active = false;
        this.nodeTabBank.node.getChildByName("act").getComponent(cc.Sprite).node.active = false;
     //   this.nodeTabMomo.node.getChildByName("act").getComponent(cc.Sprite).node.active = false;
        this.nodeTabCoin.node.getChildByName("act").getComponent(cc.Sprite).node.active = false;
        this.nodeTabTopup.node.opacity = 255;
        this.nodeTabBank.node.opacity = 255;
   //     this.nodeTabMomo.node.opacity = 255;
        this.nodeTabCoin.node.opacity = 255;

        switch (tabName) {
            case cc.ShopTab.CARD:
                this.nodeTabActive = this.nodeCard;
                this.nodeTabTopup.node.getChildByName("act").getComponent(cc.Sprite).node.active = true;
                this.nodeTabTopup.node.opacity = 255;
                break;
            case cc.ShopTab.BANK:
                this.nodeTabActive = this.nodeBank;
                this.nodeTabBank.node.getChildByName("act").getComponent(cc.Sprite).node.active = true;
                this.nodeTabBank.node.opacity = 255;
                break;
            case cc.ShopTab.MOMO:
                 cc.PopupController.getInstance().showMessage('Tính năng đang xây dựng');
                break;
           case cc.ShopTab.COIN:
                this.nodeTabActive = this.nodeCoin;
                this.nodeTabCoin.node.getChildByName("act").getComponent(cc.Sprite).node.active = true;
                this.nodeTabCoin.node.opacity = 255;
                break;
        }
        this.nodeTabActive.active = true;
        this.currentTab = tabName;
    },

     choosebank: function (target,value) {
         //  console.log(target);
          // console.log(value);
            this.lbSelectedBank.string = value;
            this.toggleChooseValue.active = false;
            var bankcode = '';
            if(value == 'Vietcombank'){
                bankcode = 'VCB';
            }else if(value == 'ACB'){
                bankcode = 'ACB';
            }else if(value == 'BIDV'){
                bankcode = 'BIDV';
            }else if(value == 'DongA'){
                bankcode = 'DAB';
            }else if(value == 'Sacombank'){
                bankcode = 'SCB';
            }else if(value == 'Techcombank'){
                bankcode = 'TCB';
            }else if(value == 'VietinBank'){
                bankcode = 'VTB';
            }else if(value == 'MB'){
                bankcode = 'MB';
            }else if(value == 'Agribank'){
                bankcode = 'AGR';
            }
            for (var i = 0; i < this.listbankcodepay.length; i++) {
                var code = this.listbankcodepay[i].code;
                if(code == bankcode){
                    this.banks = this.listbankcodepay[i].name;
                    this.bankCode = this.listbankcodepay[i].code;
                    var chargeBankCommand = new cc.ChargeBankCommand;
                    chargeBankCommand.execute(this);
                }
            }
        },

    showShopBusy: function () {
        this.nodeBusy.active = true;
    },

    hideShopBusy: function () {
        if (this.nodeBusy)
            this.nodeBusy.active = false;
    },

    closeClicked: function () {
        //this.showRegister(false);
        this.animation.play('closePopup');
        var self = this;
        var delay = 0.12;
        cc.director.getScheduler().schedule(function () {
            self.animation.stop();
            cc.LobbyController.getInstance().destroyShopCastOutView();
        }, this, 1, 0, delay, false);
    }
    // update (dt) {},
});
