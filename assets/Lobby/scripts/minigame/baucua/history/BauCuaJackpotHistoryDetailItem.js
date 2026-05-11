cc.BauCuaJackpotHistoryDetailItem = cc.Class({
    extends: cc.Component,

    properties: {
        line: cc.Node,
        rank: cc.Label,
        ranktop1: cc.Node,
        ranktop2: cc.Node,
        ranktop3: cc.Node,
        nickname: cc.Label,
        money: cc.Label,
    },

    updateItem(itemData, idx) {
        this.nickname.string = itemData.Nickname;
        this.rank.string = idx+1;
        this.money.string = `${cc.Tool.getInstance().formatNumber(itemData.Award)}`;
        if(idx == 0){
            this.ranktop1.active = true;
            this.ranktop2.active = false;
            this.ranktop3.active = false;
            this.rank.active = false;
        }else if(idx == 1){
            this.ranktop1.active = false;
            this.ranktop2.active = true;
            this.ranktop3.active = false;
            this.rank.active = false;
        }else if(idx == 2){
            this.ranktop1.active = false;
            this.ranktop2.active = false;
            this.ranktop3.active = true;
            this.rank.active = false;
        }else{
            this.ranktop1.active = false;
            this.ranktop2.active = false;
            this.ranktop3.active = false;
            this.rank.active = true;
        }
        
    },

    update() {
    },
   
    formatmoney(money){
        var moneyoutput = money;
        var moneytemp = 0;
        if(money > 1000000){
            moneytemp = money/1000000;
            moneyoutput = moneytemp.toFixed(2) + ' M';
        }else if(money > 1000){
            moneytemp = money/1000;
            moneyoutput = moneytemp.toFixed(2) + ' K';
        }
        return moneyoutput;
        
    }
});
