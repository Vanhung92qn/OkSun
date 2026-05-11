/**
 * Created by Welcome on 5/28/2019.
 */

var netConfig = require('NetConfig');

(function () {
    cc.XXView = cc.Class({
        "extends": cc.Component,
        properties: {
            spriteSound: cc.Sprite,
            sfSounds: [cc.SpriteFrame], //0=on, 1=off

            spriteBack: cc.Sprite,
            nodeRegisterLeave: cc.Node,

            nodeParentChat: cc.Node,
            prefabChat: cc.Prefab,
        },

        onLoad: function () {
            cc.XXController.getInstance().setXXView(this);
            cc.ChatRoomController.getInstance().setHubView(this);
            // console.log("XXView onLoad");
            var nodeChat = cc.instantiate(this.prefabChat);
            this.nodeParentChat.addChild(nodeChat);

            this.interval = null;
            this.isActiveChat = false;

            this.lastTimeReconnect = (new Date()).getTime();

            this.connectHub();
            //	this.enableChooseRoom(false);

            this.currentState = -1;

            //id send playNow
            this.idPlayNow = 0;

            //dang dang ky leaveRoom
            this.isRegisterLeaveRoom = false;
            this.timeouts = [];


        },

        start: function () {
            //Check Sound
            this.sound = cc.Tool.getInstance().getItem("@Sound").toString() === 'true';

            this.spriteSound.spriteFrame = this.sound ? this.sfSounds[0] : this.sfSounds[1];

            cc.AudioController.getInstance().enableSound(this.sound);
        },

        onEnable: function () {
            cc.BalanceController.getInstance().updateBalance(cc.BalanceController.getInstance().getBalance());
            cc.PopupController.getInstance().hideBusy();
        },
        //     enableChooseRoom: function (enable) {
        //      //   this.nodeChooseRoomView.active = enable;
        //       //  this.nodeMainRoomView.active = !enable;
        //
        //         cc.LobbyController.getInstance().activeNodeTopBar(enable);
        //     },		

        onDestroy: function () {
            cc.LobbyJackpotController.getInstance().pauseUpdateJackpot(false);
            this.sendRequestOnHub(cc.MethodHubName.EXIT_LOBBY);

            if (this.interval !== null) {
                clearInterval(this.interval);
            }
            this.timeouts.forEach(function (t) {
                clearTimeout(t);
            })
            this.timeouts = [];
            if (this.xxHub)
                this.xxHub.disconnect();

            this.unscheduleAllCallbacks();
            cc.XXController.getInstance().setXXView(null);

            if (cc.sys.isNative) {
                cc.assetManager.releaseAsset('xocxoc/prefabs');
                cc.assetManager.releaseAsset('xocxoc/images');
            }
            cc.PopupController.getInstance().hideBusy();
        },

        reset: function () {
            this.isTimer = false;
            this.timer = 0;
            this.currentState = 999;
            if (this.interval !== null) {
                clearInterval(this.interval);
            }
        },

        stopTimer: function () {
            this.isTimer = false;
            if (this.interval !== null) {
                clearInterval(this.interval);
            }
        },

        updateInfo: function (sessionInfo) {

            //luu lai state hien tai

            switch (sessionInfo.CurrentState) {
                case cc.XXState.BETTING:

                    break;
                case cc.XXState.OPEN_PLATE:

                    break;
                case cc.XXState.SHOW_RESULT:

                    break;
                case cc.XXState.WAITING:

                    break;
                case cc.XXState.SHAKING:

                    break;
            }

            this.currentState = sessionInfo.CurrentState;
            console.log("updateInfo: " + JSON.stringify(sessionInfo));
            // this.startTimer(sessionInfo.Ellapsed);
        },


        updateTimer: function (time) {
            if (time < 1) return;
            // this.lbTimer.string = cc.Tool.getInstance().convertSecondToTime2(time);

            switch (this.currentState) {
                case cc.XXState.BETTING:
                case cc.XXState.OPEN_PLATE:
                    this.lbTimer.string = time;
                    this.lbTimer.font = time > 3 ? this.bmfNormal : this.bmfRed;
                    this.lbTimer.node.parent.active = true;
                    break;
                case cc.XXState.SHOW_RESULT:
                    this.lbTimer.node.parent.active = false;
                    break;
                case cc.XXState.WAITING:
                    this.lbTimer.node.parent.active = false;
                    break;
                case cc.XXState.SHAKING:
                    this.lbTimer.node.parent.active = false;
                    break;
            }
        },

        disconnectAndLogout: function () {
            if (this.xxHub) {
                this.xxHub.disconnect();
            }
            this.lastTimeReconnect = (new Date()).getTime();
        },

        getCurrentSubdomain: function () {
            var gameId = cc.RoomController.getInstance().getGameId();
            return gameId == cc.GameId.XOCDIA ? cc.SubdomainName.XOC_DIA_TL : cc.SubdomainName.XOC_XOC;
        },

        getCurrentHubName: function () {
            var gameId = cc.RoomController.getInstance().getGameId();
            return gameId == cc.GameId.XOCDIA ? cc.HubName.XocDiaTLHub : cc.HubName.XocXocHub;
        },

        connectHub: function () {
            var negotiateCommand = new cc.NegotiateCommand;
            negotiateCommand.execute(this, this.getCurrentSubdomain());
        },

        reconnect: function () {
            this.lastTimeReconnect = (new Date()).getTime();
            this.xxHub.connect(this, this.getCurrentHubName(), this.connectionToken, true);
        },

        //data1 = amount
        //data2 = gate
        sendRequestOnHub: function (method, data1, data2) {
            switch (method) {
                case cc.MethodHubName.ENTER_LOBBY:
                    this.xxHub.enterLobby();
                    break;
                case cc.MethodHubName.EXIT_LOBBY:
                    this.xxHub.exitLobby();
                    break;
                case cc.MethodHubName.PLAY_NOW:
                    this.idPlayNow = this.xxHub.getRecentID();
                    this.xxHub.playNow();
                    break;
                case cc.MethodHubName.BET:
                    this.xxHub.bet(data1, data2);
                    break;
                case cc.MethodHubName.REGISTER_LEAVE_ROOM:
                    this.xxHub.registerLeaveRoom();
                    break;
                case cc.MethodHubName.UNREGISTER_LEAVE_ROOM:
                    this.xxHub.unRegisterLeaveRoom();
                    break;
                case cc.MethodHubName.SEND_MESSAGE:
                    this.xxHub.sendRoomMessage(data1);
                    break;
            }
        },

        onSlotsNegotiateResponse: function (response) {
            this.connectionToken = response.ConnectionToken;
            this.xxHub = new cc.Hub;
            this.xxHub.connect(this, this.getCurrentHubName(), response.ConnectionToken);
        },

        onHubMessage: function (response) {

            if (response.M !== undefined && response.M.length > 0) {
                var mArray = response.M;
                //console.log(mArray);
                mArray.map(m => {
                    switch (m.M) {
                        //Thong tin phien
                        case cc.MethodHubOnName.SESSION_INFO:
                            // cc.XXController.getInstance().updateSessionId(m.A[0].SessionID);
                            //console.log(m.A[0]);
                            cc.XXController.getInstance().updateInfo(m.A[0], m.A[0].Phrase, m.A[0].Elapsed);
                            cc.XXController.getInstance().updateInput(m.A[0].Phrase);
                            break;
                        //Lich su choi
                        case cc.MethodHubOnName.GAME_HISTORY:
                            //console.log(m.A[0]);
                            //cc.XXController.getInstance().resetDraw();
                            //ve bang Soi Cau
                            // console.log('Soi Cau data:', m.A[0]);
                            cc.XXController.getInstance().draw(m.A[0]);
                            break;
                        //thoi gian + trang thai phien
                        case cc.MethodHubOnName.START_ACTION_TIMER:
                            var data = m.A;
                            cc.XXController.getInstance().updateInfo(data[0], data[2], data[1]);
                            // cc.XXController.getInstance().updateResult(data[0].Players, data[0].GameLoop.Result, data[0].GameLoop.OriginResult, data[2]);
                            cc.XXController.getInstance().updateResult(null, data[0].Result, data[0].Result.ChipsData, data[2], null, data[0]);
                            cc.XXController.getInstance().updateInput(data[2]);
                            break;
                        //nguoi choi roi ban
                        case cc.MethodHubOnName.PLAYER_LEAVE:
                            //phuc vu cho bot Xoc Xoc -> can thoat nhieu ng choi
                            if (mArray.length === 0) {
                                cc.XXController.getInstance().playerLeave(m.A);
                            }
                            break;

                        //cap nhat trang thai cua nguoi choi
                        case cc.MethodHubOnName.UPDATE_CONNECTION_STATUS:
                            cc.XXController.getInstance().updateConnectionStatus(m.A);
                            break;

                        //cập nhật lại trạng thái player
                        case cc.MethodHubOnName.UPDATE_PLAYER_STATUS:
                            cc.XXController.getInstance().updatePlayerStatus(m.A[0]);
                            break;

                        //vao phong
                        case cc.MethodHubOnName.JOIN_GAME:
                            var data = m.A[0];
                            var info = m.A[1];
                            cc.XXController.getInstance().updateInfoCurrPlayer(data.Account);
                            cc.PopupController.getInstance().hideBusy();
                            break;
                        //Tai hien cac cua da dat
                        case cc.MethodHubOnName.BET_SESSION:
                            cc.XXController.getInstance().showLastInput(m.A[0]);
                            break;
                        //Thong tin bet cua nguoi choi
                        case cc.MethodHubOnName.BET_OF_ACCOUNT:
                            break;
                        //thong tin nguoi choi dat cuoc
                        case cc.MethodHubOnName.PLAYER_BET:
                            var data = m.A;
                            cc.XXController.getInstance().playerBet(data);
                            break;
                        case cc.MethodHubOnName.BET_SUCCESS:
                            break;
                        //Thong tin win cua vip
                        case cc.MethodHubOnName.WIN_RESULT_VIP:
                            if (m.A.length > 0) {
                                try {
                                    this.timeouts.push(setTimeout(function () {
                                        cc.XXController.getInstance().winResultVip(m.A[0]);
                                    }, 2500));
                                } catch (e) {

                                }

                            }
                            break;
                        //Thong tin win cua vip
                        case cc.MethodHubOnName.WIN_RESULT:
                            if (m.A.length > 0) {
                                try {
                                    this.timeouts.push(setTimeout(function () {
                                        cc.XXController.getInstance().winResult(m.A[0]);
                                    }, 2500));
                                } catch (e) {

                                }

                            }
                            break;
                        //Tong tien win groupuser
                        case cc.MethodHubOnName.TOTAL_WIN_MONEY:
                            if (m.A[0] > 0) {
                                this.timeouts.push(setTimeout(function () {
                                    cc.XXController.getInstance().totalUserWin(m.A[0]);
                                }, 2500));
                            }
                            break;
                        //thong bao khi dat cuoc
                        case cc.MethodHubOnName.PLAYER_MESSAGE:
                            cc.PopupController.getInstance().showMessage(m.A[0]);
                            break;

                        //thong bao
                        case cc.MethodHubOnName.MESSAGE:
                            cc.PopupController.getInstance().showMessage(m.A[0]);
                            break;

                        //mo bat
                        case cc.MethodHubOnName.OPEN_PLATE_NOW:
                            cc.XXController.getInstance().updateResult(null, m.A[0], m.A[1], cc.XXState.OPEN_PLATE, true);
                            cc.XXController.getInstance().updateInput(cc.XXState.OPEN_PLATE);
                            break;

                        //nhan message chat
                        case cc.MethodHubOnName.RECEIVE_MESSAGE:
                            cc.ChatRoomController.getInstance().addChatContent(m.A);
                            cc.XXController.getInstance().playerShowBubbleChat(m.A);
                            break;
                        case cc.MethodHubOnName.SUMMARY_PLAYER:
                            // console.log("SUMMARY_PLAYER: ", m.A[0]);
                            cc.XXController.getInstance().summaryPlayer(m.A[0]);
                            break;
                        //Cap nhat danh sach player
                        case cc.MethodHubOnName.VIP_PLAYERS:
                            let dataPlayers = m.A[0];
                            // console.log("VIP_PLAYERS: ", m.A);
                            if (dataPlayers.length > 0) {
                                cc.XXController.getInstance().vipPlayer(dataPlayers);
                            }
                            break;
                        //FIX BUG
                        case 'recieveMessage':
                            cc.ChatRoomController.getInstance().addChatContent(m.A);
                            cc.XXController.getInstance().playerShowBubbleChat(m.A);
                            break;

                        case cc.MethodHubOnName.UPDATE_ROOM_TIME:
                            cc.XXController.getInstance().updateTimer(m.A[0]);
                            break;

                        // XocDia Tu Linh — mini-slot result (push trước khi mở bát)
                        case cc.MethodHubOnName.SLOT_RESULT:
                            try {
                                cc.XXController.getInstance().applySlotResult(m.A[0]);
                            } catch (e) { console.warn('SLOT_RESULT err', e); }
                            break;

                        // XocDia Tu Linh — nổ hũ (sau khi resolve session)
                        case cc.MethodHubOnName.JACKPOT_HIT:
                            try {
                                var hit = m.A[0];
                                cc.XXController.getInstance().applyJackpotHit(hit);
                                var myId = cc.LoginController.getInstance().getUserId();
                                var winners = (hit && hit.Winners) || [];
                                var myAward = 0;
                                for (var i = 0; i < winners.length; i++) {
                                    if (winners[i].AccountID == myId) { myAward = winners[i].Award; break; }
                                }
                                if (myAward > 0) {
                                    cc.PopupController.getInstance().showMessage(
                                        '🎰 NỔ HŨ! Bạn nhận được ' + cc.Tool.getInstance().formatNumber(myAward) + ' VNĐ');
                                }
                            } catch (e) { console.warn('JACKPOT_HIT err', e); }
                            break;

                        // XocDia Tu Linh — pool init khi PlayNow
                        case cc.MethodHubOnName.JACKPOT_INFO:
                            try {
                                var jp = m.A[0];
                                if (jp) cc.XXController.getInstance().updateJackpotPool(jp.Pool);
                            } catch (e) { }
                            break;
                    }
                });


                //phuc vu cho bot Xoc Xoc -> can thoat nhieu ng choi
                if (mArray && mArray.length > 0) {
                    mArray.forEach(function (m) {
                        if (m.M === cc.MethodHubOnName.PLAYER_LEAVE) {
                            cc.XXController.getInstance().playerLeave(m.A);
                        }
                    });
                }

            } else if (response.R && response.R.AccountID) {
                //sau khi enterLobby
                cc.PopupController.getInstance().showBusy();
                this.sendRequestOnHub(cc.MethodHubName.PLAY_NOW);
            } else if (response.R && response.I === this.idPlayNow.toString()) {
                this.idPlayNow = 0;
                cc.PopupController.getInstance().hideBusy();
            } else {
                //PING PONG
                if (response.I) {
                    this.xxHub.pingPongResponse(response.I);
                }
            }
        },

        onHubOpen: function () {
            cc.PopupController.getInstance().hideBusy();
            this.sendRequestOnHub(cc.MethodHubName.ENTER_LOBBY);
            cc.PopupController.getInstance().showBusy();
        },

        onHubClose: function () {
            // cc.TaiXiuController.getInstance().reset();
            //reconnect
            // console.log((new Date()).getTime() - this.lastTimeReconnect);
            if ((new Date()).getTime() - this.lastTimeReconnect >= netConfig.RECONNECT_TIME * 1000) {
                this.reconnect();
            } else {
                cc.director.getScheduler().schedule(this.reconnect, this, netConfig.RECONNECT_TIME, 0, 0, false);
            }
        },

        onHubError: function () {
            cc.PopupController.getInstance().hideBusy();
        },

        //HubOn
        playerLeave: function (info) {
            var accID = info[0];
            if (accID === cc.LoginController.getInstance().getUserId()) {
                var message = info[1];
                cc.LobbyController.getInstance().destroyDynamicView(null);
                cc.LobbyController.getInstance().offuserguest(true);
                cc.PopupController.getInstance().showMessage(message)
            }
        },

        //huong dan
        helpClicked: function () {
            cc.XXPopupController.getInstance().createHelpView();
        },

        //lich su dat cuoc
        // lấy loại lịch sử
        historyClicked: function (event, customEventData) {
            // console.log("historyClicked");
            // console.log(event);
            // console.log(customEventData);
            cc.XXController.getInstance().setTypeHistory(customEventData);
            cc.XXPopupController.getInstance().createHistoryView();
            // if (cc.LoginController.getInstance().checkLogin()) {
            //     cc.LobbyController.getInstance().createHistoryView(cc.HistoryTab.GAME);
            //     cc.DDNA.getInstance().uiInteraction(cc.DDNAUILocation.PORTAL, 'SETTING_HISTORY', cc.DDNAUIType.BUTTON);
            // }
        },

        //bang xep hang dat cuoc
        topClicked: function () {
            cc.XXPopupController.getInstance().createTopView();
        },

        //bieu do chi tiet cac phien
        graphClicked: function () {
            cc.XXPopupController.getInstance().createGraphView();
        },

        soundClicked: function () {
            this.sound = !this.sound;
            cc.Tool.getInstance().setItem("@Sound", this.sound);
            this.spriteSound.spriteFrame = this.sound ? this.sfSounds[0] : this.sfSounds[1];
            cc.AudioController.getInstance().enableSound(this.sound);
        },

        backClicked: function () {
            cc.LobbyController.getInstance().destroyDynamicView(null);
            cc.LobbyController.getInstance().offuserguest(true);
        },

        chatClicked: function () {
            if (cc.BalanceController.getInstance().getBalance() <= 20000) {
                cc.PopupController.getInstance().showMessage("Số dư của bạn phải trên 20.000 để Chat");
            }
            cc.ChatRoomController.getInstance().showChat();
        },
    });
}).call(this);
