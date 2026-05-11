cc.TaiXiuJackpotHistoryItem = cc.Class({
    extends: cc.Component,

    properties: {
        bg: cc.Node,
        line: cc.Node,
        lblSession: cc.Label,
        lblTime: cc.Label,
        lblResult: cc.Label,
        lblJackpot: cc.Label,
        lblUserCount: cc.Label,
        vinhDanh: cc.Node,
        btnMore: cc.Button
    },

    updateItem(itemData, idx) {
        //console.log(itemData);
        this.lblSession.string = itemData.SessionId;
        this.lblTime.string = cc.Tool.getInstance().convertUTCTime(itemData.CreatedDate);
        if(itemData.ThirdDice == 6){
            this.lblResult.string = "Tài";
            this.lblUserCount.string = itemData.TotalAccountEven;
        }else{
            this.lblResult.string = "Xỉu";
            this.lblUserCount.string = itemData.TotalAccountOdd;
        }
       
        this.lblJackpot.string = `${cc.Tool.getInstance().formatNumber(itemData.Jackpot)}`;
        this.btnMore.node.off("click");
        this.btnMore.node.active = true;
       
        this.btnMore.node.on("click", function () {
            this.btnMore.node.active = false;
            for (let i = 0; i < itemData.ListUser.length || i < this.vinhDanh.childrenCount; i++) {
                let vItem = this.vinhDanh.children[i];
                if (i < itemData.ListUser.length) {
                    let vItemData = itemData.ListUser[i];
                    if (!vItem || vItem.name == "1") {
                        vItem = cc.instantiate(this.vinhDanh.children[0]);
                        vItem.parent = this.vinhDanh;
                    }
                    vItem.active = true;
                    vItem.getChildByName("lblNickname").getComponent(cc.Label).string = vItemData.Nickname;
                    vItem.getChildByName("lblCoin").getComponent(cc.Label).string = this.formatmoney(vItemData.Award);
                     
                } else if (vItem) {
                    vItem.active = false;
                }
                this.vinhDanh.getChildByName("1").setSiblingIndex(this.vinhDanh.childrenCount - 1);
                this.vinhDanh.getChildByName("1").active = true;
            }
        }.bind(this));

        for (let i = 0; i < itemData.ListUser.length || i < this.vinhDanh.childrenCount; i++) {
            let vItem = this.vinhDanh.children[i];
            if (i < itemData.ListUser.length && i < 3) {
                let vItemData = itemData.ListUser[i];
                if (!vItem || vItem.name == "1") {
                    vItem = cc.instantiate(this.vinhDanh.children[0]);
                    vItem.parent = this.vinhDanh;
                    vItem.setSiblingIndex(1);
                }
                vItem.active = true;
                vItem.getChildByName("lblNickname").getComponent(cc.Label).string = vItemData.Nickname;
                vItem.getChildByName("lblCoin").getComponent(cc.Label).string = this.formatmoney(vItemData.Award);
                 
            } else if (vItem) {
                vItem.active = false;
            }
        }
        this.vinhDanh.getChildByName("1").setSiblingIndex(this.vinhDanh.childrenCount - 1);
        this.vinhDanh.getChildByName("1").active = true;
    },

    update() {
        this.bg.height = this.node.height - 12;
        this.line.height = this.bg.height;
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
