/**
 * Created by Nofear on 3/15/2019.
 */


(function () {
    cc.TopupView = cc.Class({
        "extends": cc.Component,
        properties: {
            topupRateView: cc.TopupRateView,

            lbCardType: cc.Label,
            lbCardValue: cc.Label,
           // loaithe: cc.Label,
            animationMenuCardType: cc.Animation,
            animationMenuCardValue: cc.Animation,

            editBoxPINCard: cc.EditBox,
            editBoxSeriCard: cc.EditBox,
            editBoxCaptcha: cc.EditBox,

            nodeCardHides: [cc.Node],
          
            btnViettel: cc.Button,
            btnMobifone: cc.Button,
            btnVina: cc.Button,
            btnZing: cc.Button,
            btnVCoin: cc.Button,

            imageUrlCaptcha: cc.ImageUrl,
            btnConfirm: cc.Button,
            lbtypecard: cc.Label,
        },

        onLoad: function () {
            this.animOpenName = 'showDropdownMenu';
            this.animCloseName = 'hideDropdownMenu';

            this.topupRateView.init(this.node);
            cc.TopupController.getInstance().setTopupView(this);
          
        },

        onEnable: function () {
            this.animationMenuCardValue.node.scaleY = 0;
            this.animationMenuCardType.node.scaleY = 0;

            cc.ShopController.getInstance().getTotalCardBonus();
            this.lbCardValue.string = "Chọn Mệnh Giá Thẻ";
        },

        update: function (dt) {
            if (this.isTimerConfirm) {
                this.timerConfirm -= dt;

            }
        },

        refreshListCard: function () {
            this.topupRateView.getListCard();
        },

        activeTimeConfirm: function () {
            this.isTimerConfirm = true;
            this.timerConfirm = this.timePerConfirm;
        },

        processTimeConfirm: function () {
            if (this.timerConfirm <= 0) {
                this.isTimerConfirm = false;
                this.btnConfirm.interactable = true;

                this.lbConfirms.forEach(function (lbConfirm) {
                    lbConfirm.string = 'Nạp Thẻ';
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
            this.animationMenuCardValue.node.scaleY = 0;
            this.animationMenuCardValue.node.opacity = 255;
        },

        restoreScale: function () {
            this.animationMenuCardValue.node.scaleY = 1;
            this.animationMenuCardValue.node.opacity = 0;
        },

        resetInput: function () {
            if (this.editBoxPINCard) {
                this.editBoxPINCard.string = '';
                this.editBoxSeriCard.string = '';
            }
        },

        getCaptcha: function () {
            var getCaptchaCommand = new cc.GetCaptchaCommand;
            getCaptchaCommand.execute(this);
        },

        setLBCardType: function (value) {
            var lbCardTypetxt = 'Mệnh giá';
            // if(value == 'VIETTEL'){
            //     lbCardTypetxt = 'Viettel';
            // }else if(value == 'MOBIFONE'){
            //     lbCardTypetxt = 'Mobi';
            // }else if(value == 'VINAPHONE'){
            //     lbCardTypetxt = 'Vina';
            // }
            
            this.lbtypecard.string = lbCardTypetxt;
            this.lbCardType.string = value;
            
        },

        setLBCardValue: function (ID) {
            this.cardSelect = this.topupRateView.getCardFromID(ID);
            this.lbCardValue.string = this.lbCardType.string +' '+cc.Tool.getInstance().formatNumber(this.cardSelect.CardValue);
        },

        selectCard: function (cardType) {
            this.btnViettel.interactable = true;
            this.btnMobifone.interactable = true;
            this.btnVina.interactable = true;
            switch (cardType) {
                case cc.CardType.VIETTEL:
                    this.topupRateView.updateList(cc.CardOperatorCode.VIETTEL);
                    this.btnViettel.interactable = false;
					
                    break;
                case cc.CardType.MOBIFONE:
                    this.topupRateView.updateList(cc.CardOperatorCode.MOBIFONE);
                    this.btnMobifone.interactable = false;
					
                    break;
                case cc.CardType.VINAPHONE:
                    this.topupRateView.updateList(cc.CardOperatorCode.VINAPHONE);
                    this.btnVina.interactable = false;
                    break;
            }
        },

        onGetCaptchaResponse: function (response) {
            if (this.imageUrlCaptcha)
                this.imageUrlCaptcha.get('data:image/png;base64,' + cc.Tool.getInstance().removeStr(response[1], '\r\n'));
        },

        onChargeCardResponse: function (response) {
            if (response.Message)
                cc.PopupController.getInstance().showMessage(response.Message);
            else if (response.Description)
                cc.PopupController.getInstance().showMessage(response.Description);
            else
                cc.PopupController.getInstance().showMessage('Nạp thành công');

            cc.LobbyController.getInstance().refreshAccountInfo();
            cc.ShopController.getInstance().getTotalCardBonus();
            this.resetInput();
        },

        onChargeCardResponseError: function (response) {
            if (response.Description)
                cc.PopupController.getInstance().showMessageError(response.Description);
            else
                cc.PopupController.getInstance().showMessageError(response.Message, response.ResponseCode);

        },

        openMenuCardTypeClicked: function () {
            this.animationMenuCardType.play(this.animOpenName);
        },

        openMenuCardValueClicked: function () {
            this.animationMenuCardValue.play(this.animOpenName);
			
        },

        hideMenuCardTypeClicked: function () {
            this.animationMenuCardType.play(this.animCloseName);
        },

        hideMenuCardValueClicked: function () {
            this.animationMenuCardValue.play(this.animCloseName);
        },

        selectCardTypeEvent: function(event, data) {

            this.selectCard(data.toString());
            this.setLBCardType(data.toString());
            this.animationMenuCardType.play(this.animCloseName);
        },

        selectCardValueEvent: function(event, data) {
            this.setLBCardValue(parseInt(data.toString()));
            this.animationMenuCardValue.play(this.animCloseName);
        },

        chooseCardTypeClicked: function (event, data) {
            this.selectCard(data.toString());
            this.setLBCardType(data.toString());
			this.lbCardValue.string = "Chọn Mệnh Giá Thẻ";
			
        },

        chooseCardValueClicked: function (event, data) {
        },
        
        refreshCaptchaClicked: function () {
            this.getCaptcha();
        },
        
        topupClicked: function () {
            if (this.cardSelect === undefined) {
                cc.PopupController.getInstance().showMessage('Vui lòng chọn mệnh giá.');
                return;
            }

            this.pin = this.editBoxPINCard.string;
            this.serial = this.editBoxSeriCard.string;
            this.captcha = "";
            this.cardType = this.cardSelect.OperatorCode;
            this.cardCode = this.cardSelect.CardCode;

            if (this.pin === '') {
                cc.PopupController.getInstance().showMessage('Vui lòng nhập mã thẻ.');
                return;
            }

            if (this.serial === '') {
                cc.PopupController.getInstance().showMessage('Vui lòng nhập seri thẻ.');
                return;
            }

            var chargeCardCommand = new cc.ChargeCardCommand;
            chargeCardCommand.execute(this);
            this.activeTimeConfirm();
        }

    });
}).call(this);
