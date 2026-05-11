/**
 * Created by Nofear on 6/7/2017.
 */

var portalConfig = require('PortalConfig');

(function () {
    cc.LobbyJackpotView = cc.Class({
        "extends": cc.Component,
        properties: {
            lbiEgypts: [cc.LabelIncrement],
            lbiThreeKingdoms: [cc.LabelIncrement],
            lbiAquariums: [cc.LabelIncrement],
            lbiSonTinhThuyTinhs: [cc.LabelIncrement],
            lbiAnKheTraVangs: [cc.LabelIncrement],
            lbiKhoTangNguLongs: [cc.LabelIncrement],
            lbiDragonBalls: [cc.LabelIncrement],
            lbiBumBums: [cc.LabelIncrement],
            lbiCowboys: [cc.LabelIncrement],

            lbiMiniPokers: [cc.LabelIncrement],
            lbi777s: [cc.LabelIncrement],
            lbiBlockBusters: [cc.LabelIncrement],

            lbiShootFishs: [cc.LabelIncrement],
            lbiBauCua: cc.LabelIncrement,
            lbiXocXoc: cc.LabelIncrement,
        },

        onLoad: function () {
            
            this.mount = 0;
                cc.LobbyJackpotController.getInstance().setLobbyJackpotView(this);

                this.getJackpot();
                this.isPauseUpdateJackpot = false;
                cc.director.getScheduler().schedule(this.getJackpot, this, portalConfig.TIME_GET_JACKPOT, cc.macro.REPEAT_FOREVER, 0, this.isPauseUpdateJackpot);
            
        },
        setJackpotTx: function (moneytai,moneyxiu) {
           this.lbiTotalBetTai.tweenValueto(moneytai);
           this.lbiTotalBetXiu.tweenValueto(moneyxiu);
        },
        setJackpotTxMD5: function (moneytai,moneyxiu) {
           this.lbiTotalBetTaiMD5.tweenValueto(moneytai);
           this.lbiTotalBetXiuMD5.tweenValueto(moneyxiu);
        },
        getJackpot: function () {
            var getJackpotInfoCommand = new cc.GetJackpotInfoCommand;
            getJackpotInfoCommand.execute(this, cc.GameId.ALL);
            this.getJackpotShootFish();
          //  if(cc.LoginController.getInstance().getLoginState() == true){
           //     this.checkDevice();
            
        },

        checkDevice: function () {
            var CheckDeviceCommand = new cc.CheckDeviceCommand;
            CheckDeviceCommand.execute(this);
        },
        onCheckDeviceResponse: function (response) {
            //console.log(response);
            if(response.ResponseCode != 1){
                cc.LobbyController.getInstance().destroyDynamicView(null);
                cc.LobbyController.getInstance().offuserguest(true);
                cc.PopupController.getInstance().showMessage("Tài khoản của bạn đã được đăng nhập ở thiết bị khác");
                var logoutCommand = new cc.LogoutCommand;
                logoutCommand.execute(this);
            }
        },


        onLogoutResponse: function () {
            cc.LobbyController.getInstance().resetTopBar();

            cc.BalanceController.getInstance().updateRealBalance(0);
            cc.BalanceController.getInstance().updateBalance(0);

            //xoa token
            cc.ServerConnector.getInstance().setToken(null);
            //clear local token
            cc.Tool.getInstance().setItem("@atn", null);
            //cc.ServerConnector.getInstance().setToken(cc.Tool.getInstance().getItem("@atn"));

            cc.LobbyController.getInstance().destroyAllMiniGameView();

            cc.HubController.getInstance().disconnectPortalHub();


            //disconnect hub tx
            cc.TaiXiuController.getInstance().disconnectAndLogout();
            //connect lai voi token = null
            cc.TaiXiuController.getInstance().connectHubTx();

            cc.LoginController.getInstance().setLoginState(false);
            cc.PopupController.getInstance().closePopup();
            cc.LobbyController.getInstance().updateUILogin(true);
            //cc.LobbyController.getInstance().createLoginView();
            cc.LobbyController.getInstance().destroyAccountView();
            cc.LobbyController.getInstance().destroyShopView();

            //EVENT SAN KHO BAU
            // if (!cc.Config.getInstance().getDomainVK().includes(netConfig.HOST)) {
            //     cc.TreasureController.getInstance().resetCarrot();
            // }

            // if (cc.sys.isNative && sdkbox) {
            //     sdkbox.PluginFacebook.logout();
            // }

            cc.DDNA.getInstance().removeSessionId();
        },
        getJackpotBauCua: function () {
            var GetJackpotTXCommand = new cc.GetJackpotTXCommand;
            GetJackpotTXCommand.execute(this);
        },



         getJackpotTX: function () {
            // this.onGetJackpotShootFishResponse();
           // var GetJackpotTXCommand = new cc.GetJackpotTXCommand;
            //GetJackpotTXCommand.execute(this);
        },
        getJackpotShootFish: function () {
             //this.onGetJackpotShootFishResponse();
           var GetJackpotShootFishCommand = new cc.GetJackpotShootFishCommand;
            GetJackpotShootFishCommand.execute(this);
        },

        onGetJackpotTXResponse: function (response) {
           // console.log(response);
        },
        

        onGetJackpotShootFishResponse: function (response) {
            // response = {
            //     "code": 200,
            //     "data": {
            //         "11": 126083,
            //         "12": 200438,
            //         "13": 418573,
            //         "14": 784966,
            //         "21": 884476,
            //         "22": 1616401,
            //         "23": 3807692,
            //         "24": 7461555,
            //         "31": 7406370,
            //         "32": 14704782,
            //         "33": 36606585,
            //         "34": 73107277
            //     }
            // };
            // response = [800000, 8000000, 80000000];

            // this.lbiShootFishs[i].tweenValueto(response.data[14]);

            if (response !== null) {
                for (var i = 0; i < response.length; i++) {
                    switch (response[i].Name) {
                        // case 14:
                        //     this.lbiShootFishs[0].tweenValueto(Math.round(response[i].Value));
                        //     break;
                        // case 24:
                        //     this.lbiShootFishs[1].tweenValueto(Math.round(response[i].Value));
                        //     break;
                        case 34:
                            this.lbiShootFishs[0].tweenValueto(Math.round(response[i].Value));
                            break;
                        
                    }
                }
            }
        },

        onGetJackpotInfoResponse: function (response) {
      
            if (response !== null) {
                var self = this;
                //var gameListData = lobbyJackpotData.GameList;
                var gameListData = response.GameList;
                cc.LobbyJackpotController.getInstance().setJackpotResponse(gameListData);
                // console.log(gameListData);
                if (gameListData)
                gameListData.forEach(function (game) {
                    var roomIndex = game.RoomID - 1;

                    var jackpotFund = game.JackpotFund;
                    
                switch (game.GameID.toString()) {
                    case cc.GameId.EGYPT:
                        if (roomIndex<self.lbiEgypts.length)
                        self.lbiEgypts[roomIndex].tweenValueto(jackpotFund);
                        break;

             //       case cc.GameId.THREE_KINGDOM:
             //           if (roomIndex<self.lbiThreeKingdoms.length)
             //           self.lbiThreeKingdoms[roomIndex].tweenValueto(jackpotFund);
             //           break;

                    case cc.GameId.AQUARIUM:
                        if (roomIndex==3)
                        self.lbiAquariums[2].tweenValueto(jackpotFund);
                        break;

                    case cc.GameId.SONTINHTHUYTINH:
                         if (roomIndex==3)
                        self.lbiSonTinhThuyTinhs[2].tweenValueto(jackpotFund);
                        break;

                    case cc.GameId.ANKHETRAVANG:
                        if (roomIndex==3)
                        self.lbiAnKheTraVangs[2].tweenValueto(jackpotFund);
                        break;

                    case cc.GameId.KHOTANGNGULONG:
                        if (roomIndex==0){
                            self.lbiKhoTangNguLongs[roomIndex].tweenValueto(jackpotFund);
                        }
                        if (roomIndex==1){
                            self.lbiKhoTangNguLongs[roomIndex].tweenValueto(jackpotFund);
                        }
                        if (roomIndex==3){
                            self.lbiKhoTangNguLongs[2].tweenValueto(jackpotFund);
                        }
                        break;

                    case cc.GameId.DRAGON_BALL:
                        if (roomIndex<self.lbiDragonBalls.length)
                        self.lbiDragonBalls[roomIndex].tweenValueto(jackpotFund);
                        break;

                    case cc.GameId.COWBOY:
                        if (roomIndex<self.lbiCowboys.length)
                        self.lbiCowboys[roomIndex].tweenValueto(jackpotFund);
                        break;
                    case cc.GameId.SEVEN77:
                        if (roomIndex==1){
                            self.lbi777s[0].tweenValueto(jackpotFund);
                        }
                        if (roomIndex==2){
                            self.lbi777s[1].tweenValueto(jackpotFund);
                        }
                        if (roomIndex==3){
                            self.lbi777s[2].tweenValueto(jackpotFund);
                        }
                        break;
                
                    case cc.GameId.MINI_POKER:
                        if (roomIndex<self.lbiMiniPokers.length)
                            self.lbiMiniPokers[roomIndex].tweenValueto(jackpotFund);
                        break;
                    case cc.GameId.BAUCUA:
                        self.lbiBauCua.tweenValueto(jackpotFund);
                        break;
                    case cc.GameId.XOC_XOC:
                        self.lbiXocXoc.tweenValueto(jackpotFund);
                        break;
                
                    case cc.GameId.BLOCK_BUSTER:
                        if (roomIndex==0){
                            self.lbiBlockBusters[0].tweenValueto(jackpotFund);
                        }
                        if (roomIndex==2){
                            self.lbiBlockBusters[1].tweenValueto(jackpotFund);
                        }
                        if (roomIndex==3){
                            self.lbiBlockBusters[2].tweenValueto(jackpotFund);
                        }
                        break;
                    }
                });
            }
        },

        convertGameIdToIndex: function (gameId) {
            switch (gameId) {
                case cc.GameId.EGYPT:
                    return 0;
                    break;
            //    case cc.GameId.THREE_KINGDOM:
            //        return 1;
            //        break;
                case cc.GameId.MINI_POKER:
                    return 2;
                    break;
                case cc.GameId.SEVEN77:
                    return 3;
                    break;
            }
        },

        pauseUpdateJackpot: function (isPause) {
            this.isPauseUpdateJackpot = isPause;
            if (isPause) {
                this.unscheduleAllCallbacks();
            } else {
                cc.director.getScheduler().schedule(this.getJackpot, this, portalConfig.TIME_GET_JACKPOT, cc.macro.REPEAT_FOREVER, 0, this.isPauseUpdateJackpot);
            }
        }
    });
}).call(this);