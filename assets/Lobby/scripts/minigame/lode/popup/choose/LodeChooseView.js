(function () {
    cc.LodeChooseView = cc.Class({
        "extends": cc.Component,
        properties: {
            layoutNumber: cc.Node,
            itemNumber: cc.Prefab,
            edbBetValue: cc.EditBox,
            lbChooseNumber: cc.RichText,
            nodeConfirmBet: cc.Node,
            lbTitleBet: cc.RichText,
            lbUserBetValue: cc.RichText,
            lbTotalMoney: cc.RichText,
            //lbNumber: cc.Label,
            nodeNotify: cc.Node,
            tabs:cc.ToggleContainer

        },

        onLoad: function () {
            this.tabSelectedIdx = 0;
            cc.LodeController.getInstance().setChooseView(this);
            this.animation = this.node.getComponent(cc.Animation);
            this.node.zIndex = cc.NoteDepth.POPUP_TAIXIU;
            this.node.parent = cc.find('Canvas');
            this.notifyAnim = this.nodeNotify.getComponent(cc.Animation);
            this.lbChooseNumber.node.active = false;
            for (let i = 0; i < this.tabs.toggleItems.length; i++) {
                this.tabs.toggleItems[i].node.on("toggle", () => {
                    this.tabSelectedIdx = i;
                    this.onTabChanged();
                });
            }
        },
        onEnable: function () {
            cc.LodeController.getInstance().initNumberChooses();
            this.enableNodeConfirm(false);
        },
        //Hien thi so dat
        showTitleChooseNumber: function () {
            let numberChooses = cc.LodeController.getInstance().getNumberChooses();
            if (numberChooses.length === 0) {
                return this.hideTitleChooseNumber();
            }
            this.lbChooseNumber.node.active = true;
            let titleTyle = this.getTitleTypeBet(this.typeBet);
            let strNumber = "";
            if (numberChooses.length > 0) {
                //Neu ko phai DE_DAU, DE_CUOI them so 0 vao dau so nho hon 10
                if (this.typeBet !== cc.LodeType.DE_DAU && this.typeBet !== cc.LodeType.DE_CUOI) {
                    numberChooses = numberChooses.map(number => number = (number < 10) ? "0" + number : number);
                }
                strNumber = numberChooses.join(',');
            } else {
                strNumber = numberChooses[0];
            }
            let strTitleBet = `Đặt ${titleTyle}: <color=#22F0FF>${strNumber}</c>`;
            this.lbTitleBet.string = strTitleBet;
            this.lbChooseNumber.string = strTitleBet;
        },
        hideTitleChooseNumber: function () {
            this.lbChooseNumber.node.active = false;
        },
        //Validate so luong so dc chon theo tung loai
        isValidNumberBetOfType: function () {
            let numberChooses = cc.LodeController.getInstance().getNumberChooses();
            return (total < this.numberChoose);
        },
        unChooseNumberBefore: function () {
            let numberChooses = cc.LodeController.getInstance().getNumberChooses();
            let totalChoose = numberChooses.length;
            if (totalChoose < this.numberChoose) {
                return;
            }
            //Bo so chon cuoi
            let lastNumber = numberChooses.pop();
            //Reset sprite so cuoi
            let listNumber = this.layoutNumber.children;
            listNumber.map(number => {
                let lodeItemNumber = number.getComponent('LodeItemNumber');
                if (lodeItemNumber.numberValue === lastNumber) {
                    lodeItemNumber.reset();
                }
            });
        },
        isMaxChoose: function () {
            let numberChooses = cc.LodeController.getInstance().getNumberChooses();
            return numberChooses.length >= this.numberChoose;
        },
        showNotifyWarningChooseNumber: function () {
            this.showNotify("Bạn chỉ chọn được tối đa " + this.numberChoose + " số !");
        },
        //Mo popup chon so
        onOpenChooseNumber: function (type) {
            this.tabs.node.active = false;
            this.typeBet = parseInt(type);
            cc.LodeController.getInstance().setTypeBet(parseInt(type));
            this.numberChoose = 10;
            this.layoutNumber.width = 1050;

            switch (parseInt(type)) {
                case cc.LodeType.Lo2So:
                case cc.LodeType.Lo3So:                
                case cc.LodeType.DanhDe:
                case cc.LodeType.DeDau:
                case cc.LodeType.BaCang:
                case cc.LodeType.Lo2SoMienTrung:
                case cc.LodeType.Lo3SoMienTrung:                
                case cc.LodeType.DanhDeMienTrung:
                case cc.LodeType.DeDauMienTrung:
                case cc.LodeType.BaCangDauMienTrung:
                case cc.LodeType.BaCangDuoiMienTrung:
                case cc.LodeType.BaCangDauDuoiMienTrung:
                case cc.LodeType.Lo2SoMienNam:
                case cc.LodeType.Lo3SoMienNam:                
                case cc.LodeType.DanhDeMienNam:
                case cc.LodeType.DeDauMienNam:
                case cc.LodeType.DeDauDuoiMienNam:
                case cc.LodeType.XiuChuDauMienNam:
                case cc.LodeType.XiuChuDuoiMienNam:
                case cc.LodeType.XiuChuDauDuoiMienNam:
                
                    this.numberChoose = 10;
                    this.totalNumberChoose = 100;
                    break;

                case cc.LodeType.Dau:
                case cc.LodeType.Duoi:
                case cc.LodeType.DauMienTrung:
                case cc.LodeType.DuoiMienTrung:
                case cc.LodeType.DauMienNam:
                case cc.LodeType.DuoiMienNam:
                    this.numberChoose = 10;
                    this.totalNumberChoose = 10;
                    break;

                case cc.LodeType.Xien2:
                case cc.LodeType.Xien2MienTrung:
                case cc.LodeType.LoDa2MienNam:
                    this.numberChoose = 2;
                    this.totalNumberChoose = 100;
                    break;

                case cc.LodeType.Xien3:
                case cc.LodeType.Xien3MienTrung:
                case cc.LodeType.LoDa3MienNam:
                    this.numberChoose = 3;
                    this.totalNumberChoose = 100;
                    break;

                case cc.LodeType.Xien4:
                case cc.LodeType.Xien4MienTrung:
                case cc.LodeType.LoDa4MienNam:
                    this.numberChoose = 4;
                    this.totalNumberChoose = 100;
                    break;
            }

            //this.lbChooseNumber.string = this.numberChoose;
            if (this.typeBet == cc.LodeType.BaCang || this.typeBet == cc.LodeType.Lo3So || this.typeBet == cc.LodeType.Lo3SoMienTrung || this.typeBet == cc.LodeType.Lo3SoMienNam
                || this.typeBet == cc.LodeType.BaCangDauMienTrung || this.typeBet == cc.LodeType.BaCangDuoiMienTrung || this.typeBet == cc.LodeType.BaCangDauDuoiMienTrung
                || this.typeBet == cc.LodeType.XiuChuDauMienNam || this.typeBet == cc.LodeType.XiuChuDuoiMienNam || this.typeBet == cc.LodeType.XiuChuDauDuoiMienNam) {
                this.tabs.node.active = true;
                this.fillNumberChooseTab();
            }
            else{
                this.fillNumberChoose();
            }
            
            this.animation.play('openPopup');
        },
        getTitleTypeBet: function (type) {
            switch (type) {
                case cc.LodeType.DE:
                    return 'Đề';
                case cc.LodeType.DE_DAU:
                    return 'Đề đầu';
                case cc.LodeType.DE_CUOI:
                    return 'Đề cuối';
                case cc.LodeType.LO:
                    return 'Lô';
                case cc.LodeType.XIEN2:
                    return 'Xiên 2';
                case cc.LodeType.XIEN3:
                    return 'Xiên 3';
                case cc.LodeType.XIEN4:
                    return 'Xiên 4';
            }
        },
        onTabChanged:function() {
            this.fillNumberChooseTab();
        },
        //fill number
        fillNumberChoose: function () {
            //Clear layout
            this.layoutNumber.removeAllChildren();
            for (let i = 0; i < this.totalNumberChoose; i++) {
                let item = cc.instantiate(this.itemNumber);
                item.getComponent('LodeItemNumber').setNumber(i);
                item.parent = this.layoutNumber;
            }
        },
        fillNumberChooseTab: function () {
            //Clear layout
            this.layoutNumber.removeAllChildren();
            for (let i = this.totalNumberChoose * this.tabSelectedIdx; i < this.totalNumberChoose*this.tabSelectedIdx + this.totalNumberChoose; i++) {
                let item = cc.instantiate(this.itemNumber);
                item.getComponent('LodeItemNumber').setNumber(i);
                item.parent = this.layoutNumber;
            }
        },
        //An hien node confirm Bet
        enableNodeConfirm: function (enable) {
            this.nodeConfirmBet.active = enable;
        },
        //Mo popup xac nhan dat cuoc
        openConfirmBet: function () {
            // let arrTypeXien = [cc.LodeType.XIEN2, cc.LodeType.XIEN3, cc.LodeType.XIEN4];
            // let arrTypeMin5 = [cc.LodeType.LO, cc.LodeType.DE_DAU, cc.LodeType.DE_CUOI, cc.LodeType.XIEN2, cc.LodeType.XIEN3, cc.LodeType.XIEN4];
            // var betValue = parseFloat(cc.Tool.getInstance().removeDot(this.edbBetValue.string));
            let numberChooses = cc.LodeController.getInstance().getNumberChooses();
            // if (numberChooses.length === 0) {
            //     return this.showNotify("VUI LÒNG CHỌN SỐ!");
            // }
            // if (betValue.length == 0 || isNaN(betValue)) {
            //     return this.showNotify("VUI LÒNG NHẬP TIỀN CƯỢC!");
            // }
            // if (betValue < 1000 && this.typeBet === cc.LodeType.DE) {
            //     return this.showNotify("TIỀN CƯỢC TỐI THIỂU 1.000!");
            // }
            // if (betValue < 5000 && arrTypeMin5.includes(this.typeBet)) {
            //     return this.showNotify("TIỀN CƯỢC TỐI THIỂU 5.000!");
            // }
            //betValue = parseFloat(betValue);

            // if (this.numberChoose > numberChooses.length && arrTypeXien.includes(this.typeBet)) {
            if (numberChooses.length < 1) {
                return this.showNotify("VUI LÒNG CHỌN ÍT NHẤT 1 SỐ!");
            }

            if (numberChooses.length > this.numberChoose) {
                return this.showNotify("VUI LÒNG CHỌN " + this.numberChoose + " SỐ!");
            }
            //Neu bet Xien 2, 3, 4 -> Giu nguyen tong tien
            // this.userBet = betValue;
            // let totalBet = (arrTypeXien.includes(this.typeBet)) ? betValue : betValue * numberChooses.length;
            // //Kiem tra so du
            // if (betValue > cc.BalanceController.getInstance().getBalance()) {
            //     return this.showNotify("SỐ DƯ KHÔNG ĐỦ!");
            // }

            // this.lbUserBetValue.string = `Số tiền: <color=#FCFE03>${cc.Tool.getInstance().formatNumber(betValue)}</c>`;
            // this.lbTotalMoney.string = `Tổng tiền: <color=#FCFE03>${cc.Tool.getInstance().formatNumber(totalBet)}</c>`;
            //Convert number
            //Neu ko phai DE_DAU, DE_CUOI them so 0 vao dau so nho hon 10
            let temp = [...numberChooses];
            
            // if (this.typeBet !== cc.LodeType.DE_DAU && this.typeBet !== cc.LodeType.DE_CUOI) {
            //     numberChooses = numberChooses.map(number => number = (number < 10) ? "0" + number : number);
            // }
            let type = this.typeBet;
            if (type == cc.LodeType.BaCang || type == cc.LodeType.Lo3So || type == cc.LodeType.Lo3SoMienTrung || type == cc.LodeType.Lo3SoMienNam
                || type == cc.LodeType.BaCangDauMienTrung || type == cc.LodeType.BaCangDuoiMienTrung || type == cc.LodeType.BaCangDauDuoiMienTrung
                || type == cc.LodeType.XiuChuDauMienNam || type == cc.LodeType.XiuChuDuoiMienNam || type == cc.LodeType.XiuChuDauDuoiMienNam) {
                numberChooses =  numberChooses.map(number => number = (number < 10) ? "00" + number : ((number < 100) ? "0" + number : number));
            }
            else{
                numberChooses = numberChooses.map(item => item = (item < 10) ? "0" + item : item);
            }
            if (type == cc.LodeType.BaCang || type == cc.LodeType.Lo3So || type == cc.LodeType.Lo3SoMienTrung || type == cc.LodeType.Lo3SoMienNam
                || type == cc.LodeType.BaCangDauMienTrung || type == cc.LodeType.BaCangDuoiMienTrung || type == cc.LodeType.BaCangDauDuoiMienTrung
                || type == cc.LodeType.XiuChuDauMienNam || type == cc.LodeType.XiuChuDuoiMienNam || type == cc.LodeType.XiuChuDauDuoiMienNam) {
                //numberChooses =  numberChooses.map(number => number = (number < 10) ? "00" + number : ((number < 100) ? "0" + number : number));
                
                temp = temp.map(item => item = (item < 10) ? "00" + item : ((item < 100) ? "0" + item : item));
            }
            else{
                temp = temp.map(item => item = (item < 10) ? "0" + item : item);
            }
            //temp = temp.map(item => item = (item < 10) ? "00" + item : ((item < 100) ? "0" + item : item));
            let strNumberChooses = (temp.length > 1) ? temp.join('-') : temp[0];
            cc.LodeController.getInstance().getLodeBetView().updateNumberChoose(strNumberChooses);
            cc.LodeController.getInstance().getLodeBetView().updateTongCuoc(temp.length);
            this.onCancelClicked();
            // //this.lbNumber.string = strNumberChooses;
            // this.enableNodeConfirm(true);
        },
        //Xac nhan dat cuoc
        confirmBet: function () {
            let numberChooses = cc.LodeController.getInstance().getNumberChooses();
            let type = this.typeBet
            //format so dat
            //Neu ko phai DE_DAU, DE_CUOI them so 0 vao dau so nho hon 10
            // if (this.typeBet !== cc.LodeType.DE_DAU && this.typeBet !== cc.LodeType.DE_CUOI) {
            //     numberChooses = numberChooses.map(number => number = (number < 10) ? "0" + number : number);
            // }
            if (type == cc.LodeType.BaCang || type == cc.LodeType.Lo3So || type == cc.LodeType.Lo3SoMienTrung || type == cc.LodeType.Lo3SoMienNam
                || type == cc.LodeType.BaCangDauMienTrung || type == cc.LodeType.BaCangDuoiMienTrung || type == cc.LodeType.BaCangDauDuoiMienTrung
                || type == cc.LodeType.XiuChuDauMienNam || type == cc.LodeType.XiuChuDuoiMienNam || type == cc.LodeType.XiuChuDauDuoiMienNam) {
                numberChooses =  numberChooses.map(number => number = (number < 10) ? "00" + number : ((number < 100) ? "0" + number : number));
            }
            let cityID = cc.LodeController.getInstance().getCityID();
            let openDate = cc.LodeController.getInstance().getopenDate();
            cc.LodeController.getInstance().sendRequestOnHub(cc.MethodHubName.BET, this.typeBet, this.userBet, numberChooses.join(','),cityID,openDate);
            //Gui du lieu len server
            this.enableNodeConfirm(false);
            this.onCancelClicked();
        },
        chooseAgain: function () {
            this.enableNodeConfirm(false);
        },
        //Huy chon so
        onCancelClicked: function () {

            this.animation.play('closePopup');
            var self = this;
            var delay = 0.12;
            cc.director.getScheduler().schedule(function () {
                self.animation.stop();
                cc.LodePopupController.getInstance().destroyHistoryView();
                this.node.removeFromParent();
            }, this, 1, 0, delay, false);
        },
        showNotify: function (message) {
            this.nodeNotify.active = true;
            let labelMessage = this.nodeNotify.getChildByName('label').getComponent(cc.Label);
            labelMessage.string = message;
            this.notifyAnim.play('openPopup')
            cc.director.getScheduler().schedule(function () {
                this.nodeNotify.active = false;
            }, this, 1, 0, 0, false);
        },
        onEditingValueChanged: function () {
            var val = cc.Tool.getInstance().removeDot(this.edbBetValue.string);
            this.edbBetValue.string = cc.Tool.getInstance().formatNumberkvn1102(val);
        },

        onEditingValueDidEnd: function () {
            var val = cc.Tool.getInstance().removeDot(this.edbBetValue.string);
            this.edbBetValue.string = cc.Tool.getInstance().formatNumberkvn1102(val);
        },
    });
}).call(this);
