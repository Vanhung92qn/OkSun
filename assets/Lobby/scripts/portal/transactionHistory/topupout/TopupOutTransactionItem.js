/**
 * Created by Nofear on 3/15/2019.
 */


(function () {
    cc.TopupOutTransactionItem = cc.Class({
        "extends": cc.Component,
        properties: {
            lbTime: cc.Label,
            lbInfo: cc.Label, //Thong tin Nap
            lbValue: cc.Label, //Gia tri
        },

        onLoad: function () {
            // this.sprite = this.node.getComponent(cc.Sprite);

            this.lbValue.node.color = cc.Color.YELLOW;
        },

        updateItem: function(item, itemID) {
            if(item){
            // this.sprite.enabled = itemID % 2 === 0;
            this.lbTime.string = cc.Tool.getInstance().convertUTCTime(item.CreateDate); //UpdateDate
            if (item.SerialNumber === undefined || item.CardNumber === undefined) {
                this.lbInfo.string = 'Serial: undefined' + '\n' + 'PIN: undefined';
            } else {
                this.lbInfo.string = 'Serial: ' + item.SerialNumber + '\n' + 'PIN: ' + item.CardNumber;
            }
            this.lbValue.string = cc.Tool.getInstance().formatNumber(item.CardValue); //PrizeValue


            switch (item.Status.toString()) {
                //Thành công
                case cc.TopupState.SUCCESS:
                case cc.TopupState.ADMIN_SUCCESS:
                    break;

                //Chờ xử lý
                case cc.TopupState.PENDING:
                case cc.TopupState.PENDING1:
                case cc.TopupState.PENDING3:
                    break;

                //Thất bại
                case cc.TopupState.FAILED:
                case cc.TopupState.FAILED2:
                    break;

                //Thất bại
                default:
                    break;
            }

            this.item = item;
            this.itemID = itemID;
        }
        },

    });
}).call(this);
