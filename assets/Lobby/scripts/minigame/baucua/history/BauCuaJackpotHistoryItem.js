cc.BauCuaJackpotHistoryItem = cc.Class({
    extends: cc.Component,

    properties: {
        line: cc.Node,
        lblSession: cc.Label,
        lblTime: cc.Label,
        lblJackpot: cc.Label,
        btnMore: cc.Button,

        spriteDice1: cc.Sprite,
        spriteDice2: cc.Sprite,
        spriteDice3: cc.Sprite,
        sfDices: [cc.SpriteFrame],
    },

    updateItem(itemData, idx) {
        //this.lblSession.string = 'Hũ #'+itemData.SessionId;
        this.lblTime.string = cc.Tool.getInstance().convertUTCTime(itemData.CreatedDate);
        // if(itemData.FirstDice == 1){
        //     this.lblResult.string = "Bầu";
        //     //this.lblUserCount.string = itemData.TotalAccountEven;
        // }else if(itemData.FirstDice == 2){
        //     this.lblResult.string = "Cua";
        // }else if(itemData.FirstDice == 3){
        //     this.lblResult.string = "Cá";
        // }else if(itemData.FirstDice == 4){
        //     this.lblResult.string = "Gà";
        // }else if(itemData.FirstDice == 5){
        //     this.lblResult.string = "Tôm";
        // }else{
        //     this.lblResult.string = "Hươu";
        //     //this.lblUserCount.string = itemData.TotalAccountOdd;
        // }
        
        this.spriteDice1.spriteFrame = this.sfDices[parseInt(itemData.FirstDice) - 1];
        this.spriteDice2.spriteFrame = this.sfDices[parseInt(itemData.SecondDice) - 1];
        this.spriteDice3.spriteFrame = this.sfDices[parseInt(itemData.ThirdDice) - 1];

        this.lblJackpot.string = `${cc.Tool.getInstance().formatNumber(itemData.Jackpot)}`;
        this.btnMore.getComponent(cc.Button).clickEvents[0].customEventData = itemData.SessionId;
        // this.btnMore.node.off("click");
        // this.btnMore.node.active = true;
       
        // this.btnMore.node.on("click", function () {
        //     this.btnMore.node.active = false;
        //     for (let i = 0; i < itemData.ListUser.length || i < this.vinhDanh.childrenCount; i++) {
        //         let vItem = this.vinhDanh.children[i];
        //         if (i < itemData.ListUser.length) {
        //             let vItemData = itemData.ListUser[i];
        //             if (!vItem || vItem.name == "1") {
        //                 vItem = cc.instantiate(this.vinhDanh.children[0]);
        //                 vItem.parent = this.vinhDanh;
        //             }
        //             vItem.active = true;
        //             vItem.getChildByName("lblNickname").getComponent(cc.Label).string = vItemData.Nickname;
        //             vItem.getChildByName("lblCoin").getComponent(cc.Label).string = this.formatmoney(vItemData.Award);
                     
        //         } else if (vItem) {
        //             vItem.active = false;
        //         }
        //         this.vinhDanh.getChildByName("1").setSiblingIndex(this.vinhDanh.childrenCount - 1);
        //         this.vinhDanh.getChildByName("1").active = true;
        //     }
        // }.bind(this));
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
