var netConfig = require("NetConfig");
(function () {
    cc.LodeView = cc.Class({
        extends: cc.Component,
        properties: {
            prefabChooseView: cc.Prefab,
            //He so de
            lbMutilDe: cc.Label,
            lbMutilDeShadown: cc.Label,
            //He so de dau
            lbMutilDeDau: cc.Label,
            lbMutilDeDauShadown: cc.Label,
            //He so de cuoi
            lbMutilDeCuoi: cc.Label,
            lbMutilDeCuoiShadown: cc.Label,
            //He so lo
            lbMutilLo: cc.Label,
            lbMutilLoShadown: cc.Label,
            //He so xien 2
            lbMutilXien2: cc.Label,
            lbMutilXien2Shadown: cc.Label,
            //He so xien 3
            lbMutilXien3: cc.Label,
            lbMutilXien3Shadown: cc.Label,
            //He so xien 4
            lbMutilXien4: cc.Label,
            lbMutilXien4Shadown: cc.Label,
            lbBalance: cc.Label,

            nodeMenu: cc.Node,
        },

        onLoad: function () {
            //set zIndex
            this.node.zIndex = cc.Config.getInstance().getZINDEX();

            this.controller = cc.LodeController.getInstance();
            this.controller.setLodeView(this);
            this.hubName = cc.HubName.LodeHub;
            this.subDomainName = cc.SubdomainName.LODE;
            this.interval = null;
            this.lastTimeReconnect = new Date().getTime();
            this.lbBalance.string = cc.Tool.getInstance().formatNumber(cc.BalanceController.getInstance().getBalance());
            this.connectHub();

            this.aniMenu = this.nodeMenu.getComponent(cc.Animation);
            this.isMenuOpen = false;
        },
        //Cap nhat he so
        updateMultiple: function (data) {
            if (!data)
                return;
            data.map(multipleData => {
                let strMultiple = "1   X   " + multipleData.Multiplier;
                switch (parseInt(multipleData.GateID)) {
                    case cc.LodeType.DE:
                        this.lbMutilDe.string = strMultiple;
                        this.lbMutilDeShadown.string = strMultiple;
                        break;
                    case cc.LodeType.DE_DAU:
                        this.lbMutilDeDau.string = strMultiple;
                        this.lbMutilDeDauShadown.string = strMultiple;
                        break;
                    case cc.LodeType.DE_CUOI:
                        this.lbMutilDeCuoi.string = strMultiple;
                        this.lbMutilDeCuoiShadown.string = strMultiple;
                        break;
                    case cc.LodeType.LO:
                        this.lbMutilLo.string = strMultiple;
                        this.lbMutilLoShadown.string = strMultiple;
                        break;
                    case cc.LodeType.XIEN2:
                        this.lbMutilXien2.string = strMultiple;
                        this.lbMutilXien2Shadown.string = strMultiple;
                        break;
                    case cc.LodeType.XIEN3:
                        this.lbMutilXien3.string = strMultiple;
                        this.lbMutilXien3Shadown.string = strMultiple;
                        break;
                    case cc.LodeType.XIEN4:
                        this.lbMutilXien4.string = strMultiple;
                        this.lbMutilXien4Shadown.string = strMultiple;
                        break;
                }
            })
        },
        createView: function (prefab) {
            var nodeView = cc.instantiate(prefab);
            nodeView.parent = this.node;
            nodeView.setPosition(-this.node.x, -this.node.y);
            return nodeView;
        },
        createChooseView: function () {
            this.nodeChooseView = this.createView(this.prefabChooseView);
        },
        destroyChooseView: function () {
            if (this.nodeChooseView) this.nodeChooseView.destroy();
        },
        quickLogoutClicked: function () {
            cc.LobbyController.getInstance().destroyDynamicView(null);
            cc.LobbyController.getInstance().offuserguest(true);
            cc.DDNA.getInstance().uiInteraction(cc.DDNAUILocation.PORTAL, 'BACK', cc.DDNAUIType.BUTTON);
        },
        onOpenChooseView: function (sender, type) {
            // if (cc.LodeController.getInstance().currPharse === cc.LodePharse.WAITING) {
            //     return cc.PopupController.getInstance().showMessage("VUI LÒNG CHỜ PHIÊN TIẾP THEO!");
            // }
            this.createChooseView();
            this.nodeChooseView
                .getComponent("LodeChooseView")
                .onOpenChooseNumber(type);
        },
        onEnable: function () {
            //this.updateBalance(cc.BalanceController.getInstance().getBalance());
        },

        onDestroy: function () {
            //Exit lobby
            this.sendRequestOnHub(cc.MethodHubName.EXIT_LOBBY);
            cc.PopupController.getInstance().hideBusy();

            cc.LobbyJackpotController.getInstance().pauseUpdateJackpot(false);

            if (this.interval !== null) {
                clearInterval(this.interval);
            }
            if (this.LodeHub) this.LodeHub.disconnect();
            this.unscheduleAllCallbacks();
            cc.LodeController.getInstance().setLodeView(null);

            if (cc.sys.isNative) {
                cc.loader.releaseResDir("lode/prefabs");
                cc.loader.releaseResDir("lode/images");
            }
        },

        disconnectAndLogout: function () {
            if (this.LodeHub) {
                this.LodeHub.disconnect();
            }
            this.lastTimeReconnect = new Date().getTime();
        },

        connectHub: function () {
            cc.PopupController.getInstance().showBusy();
            var negotiateCommand = new cc.NegotiateCommand();
            negotiateCommand.execute(this, this.subDomainName);
        },

        reconnect: function () {
            this.lastTimeReconnect = new Date().getTime();
            this.LodeHub.connect(this, this.hubName, this.connectionToken, true);
        },

        sendRequestOnHub: function (method, gateId, amount, betData,cityID,openDate) {
            switch (method) {
                case cc.MethodHubName.ENTER_LOBBY:
                    this.LodeHub.enterLobby();
                    break;
                case cc.MethodHubName.BET:
                    this.LodeHub.lodeBet(gateId, amount, betData,cityID,openDate);
                    break;
            }
        },

        onSlotsNegotiateResponse: function (response) {
            this.connectionToken = response.ConnectionToken;
            this.LodeHub = new cc.Hub();
            this.LodeHub.connect(this, this.hubName, response.ConnectionToken);
        },

        onHubMessage: function (response) {
            if (response.M !== undefined && response.M.length > 0) {
                let res = response.M;
                res.map(m => {
                    switch (m.M) {
                        case cc.MethodHubOnName.CURR_SESSION_INFO:
                            // try {
                            //     cc.PopupController.getInstance().hideBusy();
                            //     this.controller.updateDataResult(m.A[0]);
                            // }catch(e) {
                            // }
                            //this.updateMultiple(m.A[0].LstGateInfo);
                            break;
                        case cc.MethodHubOnName.MESSAGE:
                            if (!cc.game.isPaused())
                                cc.PopupController.getInstance().showMessageError(m.A[0]);
                            break;
                        case cc.MethodHubOnName.BET_OF_ACCOUNT:
                            //this.controller.fillDataBetted(m.A[0]);
                            break;
                        case cc.MethodHubOnName.BET_USER:
                            this.controller.updateListBetting(m.A[0]);
                            break;
                        case cc.MethodHubOnName.BET_SUCCESS:
                            cc.PopupController.getInstance().showMessage("ĐẶT CỬA THÀNH CÔNG!");
                            //Cap nhat tien
                            let balance = m.A[1];
                            cc.BalanceController.getInstance().updateRealBalance(balance);
                            cc.BalanceController.getInstance().updateBalance(balance);
                            this.lbBalance.string = cc.Tool.getInstance().formatNumber(balance);
                            //TODO: update balance in game
                            //Cap nhat danh sach da dat cua user
                            //this.controller.updateListBetted(m.A[0]);
                            break;
                    }
                });
            } else if (response.R && response.R.AccountID) {
                //cc.PopupController.getInstance().hideBusy();
            } else {
                //PING PONG
                if (response.I) {
                    this.LodeHub.pingPongResponse(response.I);
                }
            }
        },

        onHubOpen: function () {
            this.sendRequestOnHub(cc.MethodHubName.ENTER_LOBBY);
            //cc.PopupController.getInstance().showBusy();
        },

        onHubClose: function () {
            //reconnect
            // console.log((new Date()).getTime() - this.lastTimeReconnect);
            if (
                new Date().getTime() - this.lastTimeReconnect >=
                netConfig.RECONNECT_TIME * 1000
            ) {
                this.reconnect();
            } else {
                cc.director
                    .getScheduler()
                    .schedule(
                        this.reconnect,
                        this,
                        netConfig.RECONNECT_TIME,
                        0,
                        0,
                        false
                    );
            }
        },

        onHubError: function () {
        },

        backClicked: function () {
            cc.LobbyController.getInstance().destroyDynamicView(null);
        },

        onMenuClicked: function() {
            this.isMenuOpen = !this.isMenuOpen;

            if (this.isMenuOpen)
                this.aniMenu.play('showmenu');
            else 
                this.aniMenu.play('closemenu');
        }
    });
}.call(this));
