/**
 * Created by Nofear on 3/15/2019.
 */


(function () {
    cc.TaiXiuMd5SessionDetailItem = cc.Class({
        "extends": cc.Component,
        properties: {
            lbTime: cc.Label,
            //lbSID: cc.Label,
            lbNickName: cc.Label,
            lbBet: cc.Label,
            lbRefund: cc.Label,
        },

        updateItem: function(item, itemID) {
            this.lbTime.string = cc.Tool.getInstance().convertUTCTime2(item.CreateTime);
           // this.lbSID.string = cc.Config.getInstance().getServiceNameNoFormat(item.ServiceID);
            this.lbNickName.string = item.UserName;

            this.lbBet.string = this.formatmoney(item.Bet);
            this.lbRefund.string = this.formatmoney(item.Refund);

            this.item = item;
            this.itemID = itemID;
        },
        formatmoney(money){
            var moneyoutput = money;
            var moneytemp = 0;
            if(money > 1000000){
                moneytemp = money/1000000;
                moneyoutput = moneytemp.toFixed(2) + ' M';
            }else if(money > 1000){
                moneytemp = money/1000;
                moneyoutput = moneytemp.toFixed(0) + ' K';
            }
            return moneyoutput;
            
        }
    });
}).call(this);
