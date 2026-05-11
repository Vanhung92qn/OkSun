/**sprite
 * Created by Nofear on 3/15/2019.
 */
var netConfig = require('NetConfig');
(function () {
    cc.MissionItem = cc.Class({
        "extends": cc.Component,
        properties: {
            sprite: cc.Sprite,

            lbTitle: cc.Label,
            lbDesc: cc.Label,
            lbProcess: cc.Label,

            lbMoney: cc.Label,
            isDo: cc.SpriteFrame,
            nhan: cc.SpriteFrame,
            danhan: cc.SpriteFrame
        },

        initItem: function (item, parent) {
            this.parent = parent;
            this.lbTitle.string = item.Name;
            this.lbDesc.string = item.Note;
            this.lbProcess.string = this.setProcess(parent)
            this.lbMoney.string = item.Award;

            // if (item.Status.toString() === cc.MissionStatus.ACTIVE && item.IsDo == 1) {
            //     this.sprite.spriteFrame = this.isDo;
            // } else {
            //     this.sprite.spriteFrame = this.notDo;
            // }
            if (parent.tabSelectedIdx == 0) {
               if (parent.totalBetInday >= 200000) {
                this.buttonStatus = 1; // 0:lam ,1:nhan, 2:da nhan
                this.sprite.spriteFrame = this.nhan;
                if (parent.isReceiceAwardToday == 1) {
                    this.sprite.spriteFrame = this.danhan;
                    this.buttonStatus = 2;
                }
               }
               else{
                this.sprite.spriteFrame = this.isDo;
                this.buttonStatus = 0;
               }
            } else {
                this.sprite.spriteFrame = this.isDo;
            }
            this.item = item;
        },

        updateItem: function (item) {

        },
        setProcess(parent){
            if (parent.tabSelectedIdx == 0) {
                return "(" + cc.Tool.getInstance().formatNumber(parent.totalBetInday) + "/200.000)";
            } else {
                return "(0/500.000)";
            }
        },

        onUserNhanKhuyenMaiResponse: function (response) {
            // this.sprite.spriteFrame = this.danhan;
            // this.buttonStatus = 2;
            cc.PopupController.getInstance().showMessage('Nhận thưởng 2000đ thành công ngày hôm nay');
        },
        onUserNhanKhuyenMaiResponseError: function (response) {
            console.log(response);
        },

        openClicked: function () {
            //TODO: vào game chơi(tài xỉu)

            var index = cc.MissionController.getInstance().getIndex();
            cc.MissionController.getInstance().closePopup();
            if (index == 0) {
                if (this.buttonStatus == 1) {
                    var userNhanKhuyenMai = new cc.UserNhanKhuyenMai;
                    userNhanKhuyenMai.execute(this);
                }
                else if(this.buttonStatus == 0){
                    cc.LobbyController.getInstance().joinGame(8);
                    
                }
                else{
                    cc.PopupController.getInstance().showMessage('Bạn đã nhận phần thưởng ngày hôm nay');
                }
                
            } else {
                if (cc.LoginController.getInstance().checkLogin()) {
                    
                    cc.LobbyController.getInstance().createShopView(cc.ShopTab.ONEPAY);

                }
            }
            

        }

        // closeClicked: function () {
        //     this.nodeOpen.active = true;
        //     //this.nodeClose.active = false;
        //     //this.nodeDetail.active = false;
        //     this.nodeGiftCode.active = false;
        //     //this.sprite.enabled = true;
        //     this.nodeSelect.active = false;
        // },

        // deleteClicked: function () {
        //     //chuyen sang status = -1 -> da xoa
        //     var updateStatusMailCommand = new cc.UpdateStatusMailCommand;
        //     updateStatusMailCommand.execute(this, parseInt(cc.MailStatus.DELETE));
        // },

        // openGiftcodeClicked: function () {
        //     if (cc.LoginController.getInstance().checkLogin()) {
        //         cc.Tool.getInstance().setItem('@GC', this.giftcode);
        //         cc.LobbyController.getInstance().createGiftcodeView();
        //         cc.LobbyController.getInstance().destroyAccountView();
        //     }
        // },
    });
}).call(this);
