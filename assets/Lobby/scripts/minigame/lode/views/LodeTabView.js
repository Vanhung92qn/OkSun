(function () {
    cc.LodeTabView = cc.Class({
        extends: cc.Component,
        properties: {
            btnTabs: [cc.Node],

            //nodeBetted: cc.Node,
            //nodeBetting: cc.Node,
            nodeResult: cc.Node,
            nodeChat: cc.Node,

            itemTemplate: cc.Prefab,
            //contentBetted: cc.Node,
            contentBetting: cc.Node
        },
        onLoad: function () {
            this.controller = cc.LodeController.getInstance();
            this.controller.setLodeTabView(this);

            this.nodeTabs = [this.nodeResult,this.nodeChat];
            this.btnTabDeactive = [];
            this.btnTabActive = [];
            for (var i = 0; i < this.btnTabs.length; i++) {
                this.btnTabDeactive[i] = this.btnTabs[i].getChildByName('deactive');
                this.btnTabActive[i] = this.btnTabs[i].getChildByName('active');
            }
            this.onTabClicked(null, 0); // default show result
        },
        onEnable: function () {
            this.bettingOnDayCommand = new cc.LodeBettingOnDayCommand();
            this.isEnableBetted = true;
            this.onReloadDataBetting();
        },
        onTabClicked: function (event, index) {
            for (var i = 0; i < this.btnTabActive.length; i++) {
                this.btnTabActive[i].active = (i == index) ? true : false;
                this.nodeTabs[i].active = (i == index) ? true : false;
            }
        },
        fillDataBetted: function (data) {
            //Loai - So Tien
            //reverse list
            data = data.reverse();
            data.map(betItem => {
                this.initItemBettedUI(betItem);
            }, this);
        },
        // updateListBetted: function (betItem) {
        //     try {
        //         this.contentBetted.removeAllChildren();
        //     } catch (e) {

        //     }
        //     this.initItemBettedUI(betItem);
        // },
        updateListBetting: function (betItem) {
            this.initItemBettingUI(betItem);
        },
        onGetBettingOnDayResponse: function (data) {
            if (data) {
                data = data.reverse();
                this.contentBetting.removeAllChildren();
                data.map(betItem => {
                    this.initItemBettingUI(betItem);
                }, this)
            }
        },
        //Khoi tao item UI cho tab da dat
        initItemBettedUI: function (betItem) {
            let item = cc.instantiate(this.itemTemplate);
            let richText = item.getComponent(cc.RichText);
            let totalBet = cc.Tool.getInstance().formatNumber(betItem.TotalBetValue);//cc.Tool.getInstance().formatNumberK(betItem.TotalBetValue);
            let dateBet = betItem.CreatedDateFm;
            richText.string = `Đặt <color=#FCFE03>${totalBet} ${betItem.GateName} </color><color=#22F0FF>(${betItem.BetData})</c> - ${dateBet}</color>`;
            item.parent = this.contentBetted;
        },
        //Khoi tao item UI cho tab dang dat
        initItemBettingUI: function (betItem) {
            let item = cc.instantiate(this.itemTemplate);
            let richText = item.getComponent(cc.RichText);
            let totalBet = cc.Tool.getInstance().formatNumber(betItem.TotalBetValue);//cc.Tool.getInstance().formatNumberK(betItem.TotalBetValue);
            let dateBet = betItem.CreatedDateFm;
            let displayName = betItem.DisplayName.length > 6 ? betItem.DisplayName.substring(0, 6) + '...' : betItem.DisplayName;

            richText.string = `<color=#F86503>${displayName}</c> đặt cược <color=#F86503>${totalBet}</c> <color=#20F803>(${betItem.CityName})</c> 
<color=#FA0B0B>${betItem.GateName}:</c> <color=#20F803>${betItem.BetData}</c>`;
            item.parent = this.contentBetting;
        },
        //Cap nhat danh sach
        updateListBetting: function (data) {
            this.initItemBettingUI(data);
        },
        //Hien thi tab da dat
        // onReloadDataBetted: function () {
        //     if (this.isEnableBetted)
        //         return;
        //     this.enableNodeBetted(true);
        // },
        //Hien thi tab dang dat
        onReloadDataBetting: function () {
            if (!this.isEnableBetted)
                return;
            //this.enableNodeBetted(false);
            this.bettingOnDayCommand.execute(this, cc.LodeBettingType.BETTING);
        }
    });
}).call(this);
