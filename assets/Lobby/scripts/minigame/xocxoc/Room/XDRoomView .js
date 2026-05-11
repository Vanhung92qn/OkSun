/**
 * Created by devnoname007 30/11/2023.
 */

var netConfig = require('NetConfig');
(function () {
    cc.XDRoomView = cc.Class({
        "extends": cc.Component,
        properties: {
            nodeMain: cc.Node,
            nodeRoom: cc.Node,
            nodeRoom1: cc.Node,
            nodeRoom2: cc.Node,
            nodeRoom3: cc.Node,
            lbNickName: cc.Label,
            //	nodeTopBar: cc.Node,
            musicBackground: cc.AudioSource,
            //	lbID: cc.Label,
            avatar: cc.Avatar,
            lbiBalance: cc.LabelIncrement,
            //      nodeLoading: cc.Node,
            isShowRoom: true,
            loading: cc.Node,
            progressBar: cc.ProgressBar,
            lbJackPot: cc.Label,
            lbUserRoom1: cc.Label,
            lbUserRoom2: cc.Label,
            lbUserRoom3: cc.Label,
            lbUserRoom4: cc.Label,
        },

        onLoad: function () {
            var loginResponse = cc.LoginController.getInstance().getLoginResponse();
            cc.RoomController.getInstance().setRoomView(this);
            this.hubName = '';
            //bien check active button room chua
            //     this.isActiveButtonRoom = false;
            //    this.nodeTopBar.active = true;
            //  	this.enableChooseRoom(true);
            this.nodeMain.active = true;
            this.nodeRoom.active = false;
            this.nodeRoom1.active = false;
            this.nodeRoom2.active = false;
            this.nodeRoom3.active = false;
            this.jackpotNumberInterval = null;
            this.loading.active = true;
            this.progressBar.progress = 0;
            this.loadingProgressBar();
            this.isInRoom = false;
            this.startFakeUserNumbers();
            //Lay gameId (set khi click vao big game)
            this.gameId = cc.RoomController.getInstance().getGameId();
            this.lbNickName.string = loginResponse.AccountName;
            //	this.lbID.string = 'ID: '+loginResponse.AccountID;
            this.lbiBalance.tweenValueto(loginResponse.Balance);
            this.avatar.setAvatar(cc.AccountController.getInstance().getAvatarImage(loginResponse.AvatarID));
        },

        startFakeUserNumbers: function () {
            this.stopFakeUserNumbers(); // đảm bảo không nhân đôi

            this.jackpotNumberInterval = setInterval(() => {
                if (this.isInRoom) return; // đã vào phòng thì ngừng cập nhật

                // Đồng bộ bằng thời gian
                const now = Date.now();
                const t = Math.floor(now / 1000); // giây hiện tại
                const offset = [0, 100, 200, 300]; // lệch pha cho từng room
                //canhlv
                const numbers = offset.map(o => {
                    const val = Math.sin((t + o) * 0.5) * 50 + 1000;
                    return Math.floor(val);
                });

                this.lbUserRoom1.string = numbers[0] + 100; // giả sử room 1 có 100 người
                this.lbUserRoom2.string = numbers[1] - 920;
                this.lbUserRoom3.string = numbers[2] - 920;
                this.lbUserRoom4.string = numbers[3] - 920;
            }, 1000);
        },

        stopFakeUserNumbers: function () {
            if (this.jackpotNumberInterval) {
                clearInterval(this.jackpotNumberInterval);
                this.jackpotNumberInterval = null;
            }
        },

        onDestroy: function () {
            if (this.jackpotNumberInterval) {
                clearInterval(this.jackpotNumberInterval);
                this.jackpotNumberInterval = null;
            }
        },

        // activeNodeTopBar: function (enable) {
        //     this.nodeTopBar.active = enable;
        //     this.nodeTopBar.getComponent(cc.TopBarView).isCardGame = enable;
        //     if (enable) {
        //     this.nodeTopBar.zIndex = cc.NoteDepth.TOP_BAR_CARD_GAME;
        //     //  this.refreshAccountInfo();
        //     } else {
        //     this.nodeTopBar.zIndex = cc.NoteDepth.TOP_BAR;
        //     }
        //     },

        onEnable: function () {
            if (this.isShowRoom) {
                this.nodeMain.active = true;
                this.nodeRoom.active = false;
                this.nodeRoom1.active = false;
                this.nodeRoom2.active = false;
                this.nodeRoom3.active = false;
            }
            // if (this.isShowLoading) {
            //     this.activeLoading();
            // }
            this.getJackpot();
        },

        getJackpot: function () {
            var getJackpotInfoCommand = new cc.GetJackpotInfoCommand;
            getJackpotInfoCommand.execute(this, cc.GameId.ALL);
            // console.log("getJackpot called for all games");
            // this.getJackpotShootFish();
            //  if(cc.LoginController.getInstance().getLoginState() == true){
            //     this.checkDevice();

        },
        onGetJackpotInfoResponse: function (response) {
            if (!response || !response.GameList) return;
            // Pick game theo gameId hiện tại — 63 (Xóc Đĩa Room) hay 113 (Tứ Linh).
            // Tứ Linh chỉ có jackpot ở Room 0 (Hoàng Kim Long).
            var gameId = parseInt(cc.RoomController.getInstance().getGameId());
            var entry = null;
            if (gameId === 113) {
                entry = response.GameList.find(g => g.GameID === 113 && g.RoomID === 0);
            } else {
                entry = response.GameList.find(g => g.GameID === 63);
            }
            if (entry && this.lbJackPot) {
                this.lbJackPot.string = cc.Tool.getInstance().formatNumber(entry.JackpotFund);
                console.log('💰 Jackpot game ' + gameId + ': ' + entry.JackpotFund);
            }
        },

        //    enableChooseRoom: function (enable) {
        //     //   this.nodeChooseRoomView.active = enable;
        //      //  this.nodeMainRoomView.active = !enable;
        //
        //        cc.LobbyController.getInstance().activeNodeTopBar(enable);
        //    },			
        enableMusic: function (enable) {
            if (this.musicBackground) {
                if (enable) {
                    if (!this.musicBackground.isPlaying) {
                        this.musicBackground.play();
                    }
                } else {
                    this.musicBackground.stop();
                }
            }
        },
        createHd: function () {
            cc.XXPopupController.getInstance().createHdView();

        },

        //     activeLoading: function() {
        //         this.nodeLoading.active = true;
        //         this.progressLoading.progress = 0;
        //
        //         var self = this;
        //         cc.tween(this.progressLoading)
        //             .to(3, {progress: 1})
        //             .call(() => {
        //                 if (self.isActiveButtonRoom) {
        //                     self.nodeLoading.active = false;
        //                     self.roomClicked(null, 2);
        //                 }
        //             })
        //             .start();
        //     },
        refreshAvatar: function () {
            var loginResponse = cc.LoginController.getInstance().getLoginResponse();
            this.avatar.setAvatar(cc.AccountController.getInstance().getAvatarImage(loginResponse.AvatarID));
        },
        avatarClicked: function () {
            cc.LobbyController.getInstance().createAccountView(cc.AccountTab.PROFILE);
            cc.DDNA.getInstance().uiInteraction(cc.DDNAUILocation.PORTAL, 'ACCOUNT_INFO', cc.DDNAUIType.BUTTON);
        },

        profileClicked: function () {
            cc.LobbyController.getInstance().createAccountView(cc.AccountTab.PROFILE);
            cc.DDNA.getInstance().uiInteraction(cc.DDNAUILocation.PORTAL, 'ACCOUNT_INFO', cc.DDNAUIType.BUTTON);
        },
        profileXacThuc: function () {
            cc.LobbyController.getInstance().createAccountView(cc.AccountTab.REG_PHONE);
            cc.DDNA.getInstance().uiInteraction(cc.DDNAUILocation.PORTAL, 'ACCOUNT_INFO', cc.DDNAUIType.BUTTON);
        },
        topupClicked: function () {
            if (cc.LoginController.getInstance().checkLogin()) {
                if (!cc.Config.getInstance().getDomainVK().includes(netConfig.HOST)) {
                    switch (cc.ShopController.getInstance().getChargeDefault()) { //cc.ShopController.getInstance().getChargeDefault()
                        case 'CARD':
                            cc.LobbyController.getInstance().createShopView(cc.ShopTab.TOPUP);
                            break;
                        case 'BANK':
                            cc.LobbyController.getInstance().createShopView(cc.ShopTab.BANK);
                            break;
                        case 'MOMO':
                            cc.LobbyController.getInstance().createShopView(cc.ShopTab.MOMO);
                            break;
                        default:
                            cc.LobbyController.getInstance().createShopView(cc.ShopTab.TOPUP);
                    }
                } else {
                    cc.LobbyController.getInstance().createShopView(cc.ShopTab.AGENCY);
                    cc.DDNA.getInstance().uiInteraction(cc.DDNAUILocation.PORTAL, 'AGENCY', cc.DDNAUIType.BUTTON);
                }

                cc.DDNA.getInstance().shopEntered(cc.DDNAShopName.TOPUP);
                cc.DDNA.getInstance().uiInteraction(cc.DDNAUILocation.PORTAL, 'SHOP_PURCHASE', cc.DDNAUIType.BUTTON);
            }
        },


        activeRoom: function () {
            // Bàn 0 — Hoàng Kim Long (có jackpot)
            cc.RoomController.getInstance().setRoomId(0);
            this.isInRoom = true;
            cc.XXController.getInstance().setNodeMain(1);
            this.nodeMain.active = false;
            this.nodeRoom.active = true;
            this.nodeRoom1.active = false;
            this.nodeRoom2.active = false;
            this.nodeRoom3.active = false;
            this.musicBackground.stop();
        },
        activeRoom1: function () {
            cc.RoomController.getInstance().setRoomId(1);
            this.isInRoom = true;
            cc.XXController.getInstance().setNodeMain(2);
            this.nodeMain.active = false;
            this.nodeRoom.active = false;
            this.nodeRoom1.active = true;
            this.nodeRoom2.active = false;
            this.nodeRoom3.active = false;
            this.musicBackground.stop();
        },
        activeRoom2: function () {
            cc.RoomController.getInstance().setRoomId(2);
            this.isInRoom = true;
            cc.XXController.getInstance().setNodeMain(3);
            this.nodeMain.active = false;
            this.nodeRoom.active = false;
            this.nodeRoom1.active = false;
            this.nodeRoom2.active = true;
            this.nodeRoom3.active = false;
            this.musicBackground.stop();
        },
        activeRoom3: function () {
            cc.RoomController.getInstance().setRoomId(3);
            this.isInRoom = true;
            cc.XXController.getInstance().setNodeMain(4);
            this.nodeMain.active = false;
            this.nodeRoom.active = false;
            this.nodeRoom1.active = false;
            this.nodeRoom2.active = false;
            this.nodeRoom3.active = true;
            this.musicBackground.stop();
        },
        activeRoom100: function () {
            if (cc.BalanceController.getInstance().getBalance() < 100) {
                cc.PopupController.getInstance().showMessage(
                    "Số dư không đủ để vào bàn.Vui lòng nạp thêm tiền!"
                );
                return;
            } else {
                this.nodeMain.active = false;
                this.nodeRoom.active = true;
            }
        },
        activeRoom1k: function () {
            if (cc.BalanceController.getInstance().getBalance() < 10000) {
                cc.PopupController.getInstance().showMessage(
                    "Số dư không đủ để vào bàn.Vui lòng nạp thêm tiền!"
                );
                return;
            } else {
                this.nodeMain.active = false;
                this.nodeRoom.active = true;
            }
        },
        activeRoom5k: function () {
            if (cc.BalanceController.getInstance().getBalance() < 50000) {
                cc.PopupController.getInstance().showMessage(
                    "Số dư không đủ để vào bàn.Vui lòng nạp thêm tiền!"
                );
                return;
            } else {
                this.nodeMain.active = false;
                this.nodeRoom.active = true;
            }
        },
        activeRoom10k: function () {
            if (cc.BalanceController.getInstance().getBalance() < 100000) {
                cc.PopupController.getInstance().showMessage(
                    "Số dư không đủ để vào bàn.Vui lòng nạp thêm tiền!"
                );
                return;
            } else {
                this.nodeMain.active = false;
                this.nodeRoom.active = true;
            }
        },
        activeRoom20k: function () {
            if (cc.BalanceController.getInstance().getBalance() < 200000) {
                cc.PopupController.getInstance().showMessage(
                    "Số dư không đủ để vào bàn.Vui lòng nạp thêm tiền!"
                );
                return;
            } else {
                this.nodeMain.active = false;
                this.nodeRoom.active = true;
            }
        },
        activeRoom50k: function () {
            if (cc.BalanceController.getInstance().getBalance() < 500000) {
                cc.PopupController.getInstance().showMessage(
                    "Số dư không đủ để vào bàn.Vui lòng nạp thêm tiền!"
                );
                return;
            } else {
                this.nodeMain.active = false;
                this.nodeRoom.active = true;
            }
        },
        activeRoom100k: function () {
            if (cc.BalanceController.getInstance().getBalance() < 1000000) {
                cc.PopupController.getInstance().showMessage(
                    "Số dư không đủ để vào bàn.Vui lòng nạp thêm tiền!"
                );
                return;
            } else {
                this.nodeMain.active = false;
                this.nodeRoom.active = true;
            }
        },
        activeRoom500k: function () {
            if (cc.BalanceController.getInstance().getBalance() < 5000000) {
                cc.PopupController.getInstance().showMessage(
                    "Số dư không đủ để vào bàn.Vui lòng nạp thêm tiền!"
                );
                return;
            } else {
                this.nodeMain.active = false;
                this.nodeRoom.active = true;
            }
        },
        backmain: function () {
            this.nodeMain.active = true;
            this.nodeRoom.active = false;
            this.nodeRoom1.active = false;
            this.nodeRoom2.active = false;
            this.nodeRoom3.active = false;
            this.musicBackground.play();
        },

        activeMain: function () {
            this.nodeMain.active = true;
            this.nodeRoom.active = false;
            this.nodeRoom1.active = false;
            this.nodeRoom2.active = false;
            this.nodeRoom3.active = false;
            if (this.isShowLoading) {
                this.nodeLoading.active = false;
            }

        },
        backClicked: function () {
            cc.LobbyController.getInstance().destroyDynamicView(null);
            cc.LobbyController.getInstance().offuserguest(true);
        },
        topclick: function () {
            if (cc.LoginController.getInstance().checkLogin()) {
                cc.LobbyController.getInstance().createTopView(cc.ShopTab.XOCDIA);
                //     cc.Tool.getInstance().setItem('@helpTab', cc.ShopTab.LONUOCTHAN);

            }
        },
        hdclick: function () {
            if (cc.LoginController.getInstance().checkLogin()) {
                cc.LobbyController.getInstance().createHdView(cc.ShopTab.XOCDIA);
                //     cc.Tool.getInstance().setItem('@helpTab', cc.ShopTab.LONUOCTHAN);

            }
        },
        loadingProgressBar: function () {
            cc.tween(this.progressBar)
                .to(1, { progress: 1 })
                .call(() => { this.loading.active = false; })
                .start()
        }
    });
}).call(this);
