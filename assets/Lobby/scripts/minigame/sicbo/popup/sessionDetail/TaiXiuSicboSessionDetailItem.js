/**
 * Created by Nofear on 3/15/2019.
 */


(function () {
    cc.TaiXiuSicboSessionDetailItem = cc.Class({
        "extends": cc.Component,
        properties: {
            gate: cc.Sprite,
            //lbSID: cc.Label,
            //lbNickName: cc.Label,
            lbBet: cc.Label,
            lbWin: cc.Label,
            sicboBetSideName: cc.TaiXiuSicboBetSideName,
            sprBetSide: [cc.SpriteFrame],
            colorLose: cc.Color,
            colorWin: cc.Color
        },

        updateItem: function(item, itemID) {
            console.log(item);
            this.gate.spriteFrame = this.sprBetSide[item.BetSide]; //item.BetSide;//cc.Tool.getInstance().convertUTCTime2(item.CreateTime);
            // this.lbSID.string = cc.Config.getInstance().getServiceNameNoFormat(item.ServiceID);
            this.lbBet.string = cc.Tool.getInstance().formatMoney(item.Bet);//item.UserName;
            
            this.lbWin.string = item.Award == 0 ? '-' + cc.Tool.getInstance().formatMoney(item.Bet) : '+' + cc.Tool.getInstance().formatMoney(item.Award);
            this.lbWin.node.color = item.Award == 0 ? this.colorLose : this.colorWin;

            this.item = item;
            this.itemID = itemID;
        },
    });
}).call(this);
