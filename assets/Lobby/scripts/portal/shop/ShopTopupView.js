/**
 * Created by Nofear on 3/14/2019.
 */

(function () {
    cc.ShopTopupView = cc.Class({
        "extends": cc.Component,
        properties: {
            nodeCard: cc.Node,
            nodeBank: cc.Node,
            nodeMoMo: cc.Node,
            nodeTabOnepay: cc.Button,
            nodeTabCard: cc.Button,
            nodeTabBank: cc.Button,
            nodeTabCodepay: cc.Button,
            nodeTabGiftcode: cc.Button,
            //    nodeTransfer: cc.Node,
            nodeRedeemReward: cc.Node,
            nodeViettelPay: cc.Node,
            nodeOnePay: cc.Node,
            nodeCoin: cc.Node,
            hdbank: cc.Node,
            hdcodepay: cc.Node,
            hdonepay: cc.Node,
            //   hdmomo:cc.Node,
            hdcoin: cc.Node,
            //  hdcard:cc.Node,
        },

        // use this for initialization
        onLoad: function () {
            cc.ShopController.getInstance().setShopTopupView(this);
            this.nodeTabActive = this.nodeRedeemReward || this.nodeBank;
            this.node.zIndex = cc.NoteDepth.POPUP_PORTAL;
            this.animation = this.node.getComponent(cc.Animation);
            if (this.nodeRedeemReward) {
                this.nodeRedeemReward.active = true;
            } else if (this.nodeBank) {
                this.nodeBank.active = true;
            }

        },

        onEnable: function () {
            this.animation.play('openPopup');
            var startTab = cc.Tool.getInstance().getItem('@startShopTab');
            var self = this;
            cc.director.getScheduler().schedule(function () {
                self.activeTopupTab(this.nodeRedeemReward ? cc.ShopTab.REDEEM_REWARD : cc.ShopTab.BANK);
            }.bind(this), this, 0, 0, 0.3, false);

            //this.getTotalCardBonus();
        },

        changeTabClicked: function (event, data) {
            if (data.toString() === this.currentTab) return;
            this.activeTopupTab(data.toString());

            cc.DDNA.getInstance().uiInteraction(cc.DDNAUILocation.SHOP, data.toString(), cc.DDNAUIType.BUTTON);
        },

        activeTopupTab(tabName, nickName) {
            if (nickName === undefined) {
                cc.Tool.getInstance().setItem('@nickNameAgency', '');
            } else {
                cc.Tool.getInstance().setItem('@nickNameAgency', nickName);
            }

            if (this.nodeTabActive) this.nodeTabActive.active = false;
            this.nodeTabOnepay.node.getChildByName("act").getComponent(cc.Sprite).node.active = false;
            this.nodeTabCard.node.getChildByName("act").getComponent(cc.Sprite).node.active = false;
            this.nodeTabBank.node.getChildByName("act").getComponent(cc.Sprite).node.active = false;
            this.nodeTabCodepay.node.getChildByName("act").getComponent(cc.Sprite).node.active = false;
            this.nodeTabGiftcode.node.getChildByName("act").getComponent(cc.Sprite).node.active = false;
            this.nodeTabOnepay.node.opacity = 255;
            this.nodeTabCard.node.opacity = 255;
            this.nodeTabBank.node.opacity = 255;
            this.nodeTabCodepay.node.opacity = 255;
            this.nodeTabGiftcode.node.opacity = 255;
            switch (tabName) {
                case cc.ShopTab.TOPUP:
                    this.nodeTabActive = this.nodeCard;
                    this.nodeTabCard.node.opacity = 255;
                    this.nodeTabCard.node.getChildByName("act").getComponent(cc.Sprite).node.active = true;
                    break;
                case cc.ShopTab.BANK:
                    // cc.PopupController.getInstance().showMessage('Tính năng đang bảo trì');
                    this.nodeTabActive = this.nodeBank;
                    this.nodeTabBank.node.opacity = 255;
                    this.nodeTabBank.node.getChildByName("act").getComponent(cc.Sprite).node.active = true;
                    break;
                case cc.ShopTab.MOMO:
                    this.nodeTabActive = this.nodeMoMo;
                    break;
                //  case cc.ShopTab.TRANSFER:
                //      this.nodeTabActive = this.nodeTransfer;
                //      break;
                case cc.ShopTab.REDEEM_REWARD:
                    //  cc.PopupController.getInstance().showMessage('Tính năng đang bảo trì');
                    this.nodeTabActive = this.nodeRedeemReward;
                    this.nodeTabCodepay.node.opacity = 255;
                    this.nodeTabCodepay.node.getChildByName("act").getComponent(cc.Sprite).node.active = true;
                    break;
                case cc.ShopTab.ONEPAY:
                    this.nodeTabActive = this.nodeOnePay;
                    this.nodeTabOnepay.node.opacity = 255;
                    this.nodeTabOnepay.node.getChildByName("act").getComponent(cc.Sprite).node.active = true;
                    break;
                case cc.ShopTab.VIETTEL_PAY:
                    this.nodeTabActive = this.nodeViettelPay;
                    this.nodeTabGiftcode.node.opacity = 255;
                    this.nodeTabGiftcode.node.getChildByName("act").getComponent(cc.Sprite).node.active = true;
                    break;
                case cc.ShopTab.COIN:
                    this.nodeTabActive = this.nodeCoin;
                    break;
            }
            if (this.nodeTabActive) this.nodeTabActive.active = true;

            this.currentTab = tabName;
        },

        getTotalCardBonus: function () {
            var getTotalCardBonusCommand = new cc.GetTotalCardBonusCommand;
            getTotalCardBonusCommand.execute(this);
        },
        clicklichsugiaodich: function () {
            if (cc.LoginController.getInstance().checkLogin()) {
                cc.LobbyController.getInstance().createHistoryView(cc.HistoryTab.BANK);
                cc.DDNA.getInstance().uiInteraction(cc.DDNAUILocation.PORTAL, 'SETTING_HISTORY', cc.DDNAUIType.BUTTON);

            }
        },
        clicklichsunapthe: function () {
            if (cc.LoginController.getInstance().checkLogin()) {
                cc.LobbyController.getInstance().createHistoryView(cc.HistoryTab.TOPUP);
                cc.DDNA.getInstance().uiInteraction(cc.DDNAUILocation.PORTAL, 'SETTING_HISTORY', cc.DDNAUIType.BUTTON);

            }
        },

        onGetTotalCardBonusResponse: function (obj) {
            if (this.lbCardBonus) {
                this.lbCardBonus.string = obj.TotalCard;
                if (this.totalCard !== undefined) {
                    //refresh lai list card khi so the cao khuyen mai tư 1 -> 0
                    if (this.totalCard === 1 && obj.TotalCard === 0) {
                        cc.TopupController.getInstance().refreshListCard();
                    }
                    this.totalCard = obj.TotalCard;
                } else {
                    //lan dau tien chua co -> set du lieu
                    this.totalCard = obj.TotalCard;
                }
            }
        },
        tienaoclick: function () {
            cc.PopupController.getInstance().showMessage('Tính năng sẽ sớm ra mắt');
        },



        closeClicked: function () {
            //this.showRegister(false);
            this.animation.play('closePopup');
            var self = this;
            var delay = 0.12;
            cc.director.getScheduler().schedule(function () {
                self.animation.stop();
                cc.LobbyController.getInstance().destroyShopTopupView();
            }, this, 1, 0, delay, false);
        },
        openhdbank: function () {
            this.hdbank.active = true;
        },
        closehdbank: function () {
            this.hdbank.active = false;
        },
        openhdcodepay: function () {
            this.hdcodepay.active = true;
        },
        closehdcodepay: function () {
            this.hdcodepay.active = false;
        },
        openhdonepay: function () {
            this.hdonepay.active = true;
        },
        closehdonepay: function () {
            this.hdonepay.active = false;
        },
        openhdmomo: function () {
            this.hdmomo.active = true;
        },
        closehdmomo: function () {
            this.hdmomo.active = false;
        },
        openhdcoin: function () {
            this.hdcoin.active = true;
        },
        closehdcoin: function () {
            this.hdcoin.active = false;
        },
        openhdcard: function () {
            this.hdcard.active = true;
        },
        closehdcard: function () {
            this.hdcard.active = false;
        },
        openhdgiftcode: function () {
            cc.PopupController.getInstance().showMessage('Tính năng sắp ra mắt');
        },

    });
}).call(this);
