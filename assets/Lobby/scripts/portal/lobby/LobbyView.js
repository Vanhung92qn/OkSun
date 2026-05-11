/**
 * Created by Nofear on 6/7/2017.
 */
import Tween from "../../../scripts/shootFish/common/Tween";
//import BundleControl from "../../../../Loading/script/loading/BundleControl";
var BundleControl = require("BundleControl");
var netConfig = require("NetConfig");
(function () {
  cc.LobbyView = cc.Class({
    extends: cc.Component,
    properties: {
      //prefab portal

      prefabLoginView: cc.Prefab,
      prefabAccountView: cc.Prefab,
      prefabShopTopupViewBank: cc.Prefab,
      prefabShopCastOutView: cc.Prefab,
      prefabHistoryView: cc.Prefab,
      // prefabHistoryViewBank: cc.Prefab,
      //   panelLuatchoi: cc.Node,
      //    setingview: cc.Node,
      //    showhotrophone: cc.Node,
      //  showhopthu: cc.Node,
      //    showQRcode: cc.Node,
      //    hotrosdtvn: cc.Node,
      //hotrolivechat: cc.Node,

      prefabEvent: cc.Prefab,
      prefabMission: cc.Prefab,
      prefabInbox: cc.Prefab,
      prefabSetting: cc.Prefab,
      prefabLuatchoi: cc.Prefab,
      prefabTaiApp: cc.Prefab,
      prefabHotline: cc.Prefab,

      //event - x2 Nap

      //  prefabX2Reward: cc.Prefab,

      //prefab FX summon Dragon
      //    prefabFxSummonDragon: cc.Prefab,

      //slots chinh
      //prefabShowPercentLoadGame:cc.Prefab,
      lbLoadingEgypt: cc.Label,
      progressBarAquarium: cc.ProgressBar,
      progressBarSonTinhThuyTinh: cc.ProgressBar,
      progressBarAnKheTraVang: cc.ProgressBar,
      progressBarKhoTangNguLong: cc.ProgressBar,
      progressBanCa: cc.ProgressBar,
      progressEgypt: cc.ProgressBar,
      progressDragonBall: cc.ProgressBar,
      // progressCowboy: cc.ProgressBar,
      //    progressDragonTiger: cc.ProgressBar,
      progressXocXoc: cc.ProgressBar,
      progressXocXocTL: cc.ProgressBar,
      progressXoDiaLivestream: cc.ProgressBar,
      progressTaiXiu: cc.ProgressBar,
      //   progressTaiXiuMd5: cc.ProgressBar,
      //  progressTaiXiuLivestream: cc.ProgressBar,
      //   progressTaiXiuSieuToc: cc.ProgressBar,
      progressMiniPoker: cc.ProgressBar,
      progress777: cc.ProgressBar,
      progressTQ: cc.ProgressBar,
      progressPoker: cc.ProgressBar,
      progressBACAY: cc.ProgressBar,
      //    progressThreeCards: cc.ProgressBar,
      progressTLMN: cc.ProgressBar,
      progressTLMNSolo: cc.ProgressBar,
      progressMB: cc.ProgressBar,
      progressBaccarat: cc.ProgressBar,
      progressBauCua: cc.ProgressBar,
      progressLoDe: cc.ProgressBar,
      progressSicbo: cc.ProgressBar,
      lbLoadingAquarium: cc.Label,
      lbLoadingSonTinhThuyTinh: cc.Label,
      lbLoadingAnKheTraVang: cc.Label,
      lbLoadingKhoTangNguLong: cc.Label,
      lbLoadingDragonBall: cc.Label,

      // lbLoadingCowboy: cc.Label,

      //    lbLoadingDragonTiger: cc.Label,
      lbLoadingXocXoc: cc.Label,
      lbLoadingXocXocTL: cc.Label,
      lbLoadingXocDiaLivestream: cc.Label,
      lbLoadingBauCua: cc.Label,
      lbLoadingLoDe: cc.Label,

      //minigame
      lbLoadingTaiXiu: cc.Label,
      //    lbLoadingTaiXiuMd5: cc.Label,
      lbLoadingTaiXiuLivestream: cc.Label,
      //    lbLoadingTaiXiuSieuToc: cc.Label,
      lbLoadingSicbo: cc.Label,
      lbLoadingMiniPoker: cc.Label,
      lbLoading777: cc.Label,
      lbLoadingTQ: cc.Label,

      //card game
      lbLoadingPoker: cc.Label,
      //   lbLoadingThreeCards: cc.Label,
      lbLoadingTLMN: cc.Label,
      lbLoadingBACAY: cc.Label,
      lbLoadingTLMNSolo: cc.Label,
      lbLoadingMB: cc.Label,
      lbLoadingBaccarat: cc.Label,

      //ban ca
      lbLoadingShootFish: cc.Label,

      //    nodemanutab: cc.Node,
      nodeLobbys: [cc.Node],
      nodeTopBar: cc.Node,
      nodeSetting: cc.Node,

      //audio
      audioBg: cc.AudioSource,
      joinGameSound: cc.AudioSource, //am thanh khi click vao game tu lobby
      toggleAudio: cc.Toggle,
      lbTopVp: cc.Label,

      nodeEventTop: cc.Node,
      nodeguest: cc.Node,
      nodeguest1: cc.Node,
      nodemember: cc.Node,
      nodemember1: cc.Node,
      //Esports
      lbJpbaucua: cc.Label,
      lbJpxocdiaTL: cc.Label,
      //lbLoadingEsport: cc.Label,
      btnconfirmaccount: cc.Node,
      bundleControl: cc.BundleControl,

      // cac node all, minigame, slots
      nodeAllGame: cc.Node,
      nodeMiniGames: [cc.Node],
      nodeSlotGames: [cc.Node],
      nodeGameBai: [cc.Node]

    },
    start() {
      var self = this;
      self._fetchJackpots();
      self._jpTimer = setInterval(function () { self._fetchJackpots(); }, 5000);
    },

    onDestroy() {
      if (this._jpTimer) { clearInterval(this._jpTimer); this._jpTimer = null; }
    },

    _fetchJackpots: function () {
      var self = this;
      self._fetchJsonGet("https://xocdiatl.oksun.win/api/jackpot", function (data) {
        if (!data || data.pool == null) return;
        if (self.lbJpxocdiaTL) Tween.numberTo(self.lbJpxocdiaTL, data.pool, 1);
      });
      self._fetchJsonGet("https://baucua.oksun.win/api/jackpot", function (data) {
        if (!data || data.pool == null) return;
        if (self.lbJpbaucua) Tween.numberTo(self.lbJpbaucua, data.pool, 1);
      });
    },

    _fetchJsonGet: function (url, cb) {
      try {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.timeout = 8000;
        xhr.onreadystatechange = function () {
          if (xhr.readyState !== 4) return;
          if (xhr.status >= 200 && xhr.status < 300) {
            try { cb(JSON.parse(xhr.responseText)); } catch (e) { cb(null); }
          } else { cb(null); }
        };
        xhr.send();
      } catch (e) { cb(null); }
    },

    // use this for initialization
    onLoad: function () {
      if (cc.sys.isNative && cc.sys.isMobile) {
        jsb.device &&
          jsb.device.setKeepScreenOn &&
          jsb.device.setKeepScreenOn(true);
      }
      this.nodeTopBar.active = true;
      //	  this.btnconfirmaccount.active = true;
      this.nodeguest.active = true;
      this.nodeguest1.active = true;
      this.nodemember.active = false;
      this.nodemember1.active = false;

      cc.LobbyController.getInstance().setLobbyView(this);
      this.nodeTaiXiu = null;
      this.nodeTaiXiuMd5 = null;
      this.nodeTaiXiuLivestream = null;
      this.nodeTaiXiuSieuToc = null;
      this.nodeSicbo = null;
      this.nodeEsport = null;
      this.nodeMiniPoker = null;
      this.node777 = null;
      this.nodeTQ = null;
      this.nodeLW = null;
      this.nodeSlotsView = null;
      // this.nodeVQMMView = null;
      var tool = cc.Tool.getInstance();
      if (tool.getItem("@onAudioBg") !== null) {
        if (tool.getItem("@onAudioBg") === "true") {
          this.IsOnAudioBg = true;
        } else {
          this.IsOnAudioBg = false;
        }
      } else {
        this.IsOnAudioBg = true;
      }
      this.isMiniGame = false;
      this.isClickSelectGame = -1;
      this.isReloadNodeSelectGame = false;
    },

    onEnable: function () {
      if (this.IsOnAudioBg) {
        this.audioBg.play();
      } else {
        this.audioBg.stop();
      }

      if (!cc.LoginController.getInstance().getLoginState()) {
        var tool = cc.Tool.getInstance();
        if (tool.getItem("@isLanding") !== null) {
          if (tool.getItem("@isLanding") === "true") {
            cc.LobbyController.getInstance().showRegisterView();
          }
        }
      }
    },
    livechat: function () {
      cc.sys.openURL(cc.Config.getInstance().liveChat());
    },
    fanpage: function () {
      cc.sys.openURL(cc.Config.getInstance().fanPageFB());
    },
    actsodienthoai() {
      this.showhotrophone.active = !this.showhotrophone.active;
      return;
    },
    actshowhopthu() {
      this.showhopthu.active = !this.showhopthu.active;
      return;
    },
    actshowQRcode() {
      this.showQRcode.active = !this.showQRcode.active;
      return;
    },

    actsetingview() {
      this.setingview.active = !this.setingview.active;
      return;
    },
    acthotro() {
      this.hotrosdtvn.active = !this.hotrosdtvn.active;
      return;
    },
    actLuatchoi() {
      this.panelLuatchoi.active = !this.panelLuatchoi.active;
      return;
    },
    acthotrolivechat() {
      this.hotrolivechat.active = !this.hotrolivechat.active;
      return;
    },

    //event X2
    createX2PopupView: function () {
      this.nodeX2Popup = this.createView(this.prefabX2Popup);
    },

    destroyX2PopupView: function () {
      if (this.nodeX2Popup) this.nodeX2Popup.destroy();
    },

    createX2RewardView: function () {
      this.nodeX2Reward = this.createView(this.prefabX2Reward);
    },

    destroyX2RewardView: function () {
      if (this.nodeX2Reward) this.nodeX2Reward.destroy();
    },

    //event san KHO BAU
    createEventPopupView: function () {
      if (cc.Config.getInstance().getDomainVK().includes(netConfig.HOST)) {
        this.nodeEventPopup = this.createView(this.prefabEventPopup);
      } else {
        this.nodeEventPopup = this.createView(this.prefabEventVNPopup);
      }
    },

    destroyEventPopupView: function () {
      if (this.nodeEventPopup) this.nodeEventPopup.destroy();
    },

    //event san KHO BAU
    createTreasureView: function () {
      this.nodeTreasureView = this.createView(this.prefabTreasure);
    },

    destroyTreasureView: function () {
      if (this.nodeTreasureView) this.nodeTreasureView.destroy();
    },

    //buy carrot
    createBuyCarrotView: function () {
      this.nodeBuyCarrotView = this.createView(this.prefabBuyCarrot);
    },

    destroyBuyCarrotView: function () {
      if (this.nodeBuyCarrotView) this.nodeBuyCarrotView.destroy();
    },

    //chon qua vat ly
    createTreasureGiftView: function () {
      this.nodeTreasureGiftView = this.createView(this.prefabTreasureGift);
    },

    destroyTreasureGiftView: function () {
      if (this.nodeTreasureGiftView) this.nodeTreasureGiftView.destroy();
    },

    //carrot daily bonus popup
    createCarrotDailyBonusView: function () {
      this.nodeCarrotDailyBonusView = this.createView(
        this.prefabCarrotDailyBonus
      );
    },

    destroyCarrotDailyBonusView: function () {
      if (this.nodeCarrotDailyBonusView)
        this.nodeCarrotDailyBonusView.destroy();
    },

    //treasure rule popup
    createTreasureRuleView: function () {
      this.nodeTreasureRuleView = this.createView(this.prefabTreasureRule);
    },

    destroyTreasureRuleView: function () {
      if (this.nodeTreasureRuleView) this.nodeTreasureRuleView.destroy();
    },

    //treasure top popup
    createTreasureTopView: function () {
      this.nodeTreasureTopView = this.createView(this.prefabTreasureTop);
    },

    destroyTreasureTopView: function () {
      if (this.nodeTreasureTopView) this.nodeTreasureTopView.destroy();
    },

    //Fx
    createFxSummonDragon: function () {
      this.nodeFxSummonDragon = this.createView(this.prefabFxSummonDragon);
    },

    destroyFxSummonDragon: function () {
      if (this.nodeFxSummonDragon) this.nodeFxSummonDragon.destroy();
    },
    //end fx

    //Portal Portal Portal
    createLoginView: function () {
      this.nodeLoginView = this.createView(this.prefabLoginView);
    },

    destroyLoginView: function () {
      if (this.nodeLoginView) this.nodeLoginView.destroy();
    },

    //createVQMMView: function () {
    //  if (this.nodeVQMMView === null) {
    //      this.nodeVQMMView = this.createView(this.prefabVQMM);
    //  }
    // },

    // destroyVQMMView: function () {
    //  if (this.nodeVQMMView) {
    //   this.nodeVQMMView.destroy();
    //   this.nodeVQMMView = null;
    // }
    //   },

    createHistoryView: function () {
      // if (cc.Config.getInstance().getServiceId() === cc.ServiceId.BLOCK_BUSTER_3
      //     || cc.Config.getInstance().getServiceId() === cc.ServiceId.BLOCK_BUSTER_2) {
      //     this.nodeHistoryView = this.createView(this.prefabHistoryViewBank);
      // } else {
      //     this.nodeHistoryView = this.createView(this.prefabHistoryView);
      // }

      if (!cc.Config.getInstance().getDomainVK().includes(netConfig.HOST)) {
        //this.nodeHistoryView = this.createView(this.prefabHistoryViewBank);
        this.nodeHistoryView = this.createView(this.prefabHistoryView);
      }

      //hide cac node o lobby
      // this.activeNodeLobby(false);
    },

    destroyHistoryView: function () {
      // this.activeNodeLobby(true);

      //cc.BannerController.getInstance().switchPage();

      if (this.nodeHistoryView) this.nodeHistoryView.destroy();
    },

    createAccountView: function () {
      this.nodeAccountView = this.createView(this.prefabAccountView);
      //hide cac node o lobby
      // this.activeNodeLobby(false);
    },

    destroyAccountView: function () {
      // this.activeNodeLobby(true);

      //cc.BannerController.getInstance().switchPage();

      cc.LobbyController.getInstance().refreshAccountInfo();
      if (this.nodeAccountView) this.nodeAccountView.destroy();
    },

    createSecurityView: function () {
      this.nodeSecurityView = this.createView(this.prefabSecurityView);
      //hide cac node o lobby
      // this.activeNodeLobby(false);
    },

    destroySecurityView: function () {
      cc.LobbyController.getInstance().refreshAccountInfo();
      if (this.nodeSecurityView) this.nodeSecurityView.destroy();
    },

    createPopupUpdateUserPassView: function () {
      this.nodePopupUpdateUserPass = this.createView(
        this.prefabPopupUpdateUserPass
      );
    },

    destroyPopupUpdateUserPassView: function () {
      cc.LobbyController.getInstance().refreshAccountInfo();
      if (this.nodePopupUpdateUserPass) this.nodePopupUpdateUserPass.destroy();
    },

    createShopTopupView: function () {
      // if (cc.Config.getInstance().getServiceId() === cc.ServiceId.BLOCK_BUSTER_3) {
      //     this.nodeShopTopupView = this.createView(this.prefabShopTopupViewBank);
      // } else {
      //     this.nodeShopTopupView = this.createView(this.prefabShopTopupView);
      // }

      this.nodeShopTopupView = this.createView(this.prefabShopTopupViewBank);

      //hide cac node o lobby
      // this.activeNodeLobby(false);
    },

    destroyShopTopupView: function () {
      // this.activeNodeLobby(true);

      //cc.BannerController.getInstance().switchPage();

      cc.LobbyController.getInstance().refreshAccountInfo();
      if (this.nodeShopTopupView) this.nodeShopTopupView.destroy();
      //hide cac node o lobby
    },

    createShopCastOutView: function () {
      // if (cc.Config.getInstance().getServiceId() === cc.ServiceId.BLOCK_BUSTER_3) {
      //     this.nodeShopTopupView = this.createView(this.prefabShopTopupViewBank);
      // } else {
      //     this.nodeShopTopupView = this.createView(this.prefabShopTopupView);
      // }
      this.nodeShopCastOutView = this.createView(this.prefabShopCastOutView);

      //hide cac node o lobby
      // this.activeNodeLobby(false);
    },
    offuserguest: function () {
      this.nodeguest.active = false; //false
      this.nodeguest1.active = false;
      this.nodemember.active = true
      this.nodemember1.active = true
    },

    destroyShopCastOutView: function () {
      // this.activeNodeLobby(true);

      //cc.BannerController.getInstance().switchPage();

      cc.LobbyController.getInstance().refreshAccountInfo();
      if (this.nodeShopCastOutView) this.nodeShopCastOutView.destroy();
      //hide cac node o lobby
    },

    createShopView: function () {
      if (!cc.Config.getInstance().getDomainVK().includes(netConfig.HOST)) {
        // this.nodeShopView = this.createView(this.prefabShopView);
        // this.nodeShopView = this.createView(this.prefabShopViewBank);

        if (
          cc.Config.getInstance().getServiceId() === cc.ServiceId.BLOCK_BUSTER_3
        ) {
          this.nodeShopView = this.createView(this.prefabShopViewBank);
        } else {
          this.nodeShopView = this.createView(this.prefabShopView);
        }
      }

      //hide cac node o lobby
      // this.activeNodeLobby(false);
    },

    destroyShopView: function () {
      // this.activeNodeLobby(true);

      //cc.BannerController.getInstance().switchPage();

      cc.LobbyController.getInstance().refreshAccountInfo();
      if (this.nodeShopView) this.nodeShopView.destroy();
      //hide cac node o lobby
    },

    createEventView: function () {
      this.nodeEventView = this.createView(this.prefabEvent);
    },
    createMissionView: function () {
      this.nodeMissionView = this.createView(this.prefabMission);
    },

    destroyMissionView: function () {
      if (this.nodeMissionView) {
        this.nodeMissionView.destroy();
        this.nodeMissionView = null;
      }
    },
    createInboxView: function () {
      this.nodeInboxView = this.createView(this.prefabInbox);
    },
    destroyInboxView: function () {
      if (this.nodeInboxView) {
        this.nodeInboxView.destroy();
        this.nodeInboxView = null;
      }
    },
    creatSettingView: function () {
      this.nodeSettingView = this.createView(this.prefabSetting);
    },
    destroySettingView: function () {
      if (this.nodeSettingView) {
        this.nodeSettingView.destroy();
        this.nodeSettingView = null;
      }
    },
    createLuatchoiView: function () {
      this.nodeLuatchoiView = this.createView(this.prefabLuatchoi);
    },
    closeKhSdt: function () {
      this.btnconfirmaccount.active = false;
    },
    openKhSdt: function () {
      this.btnconfirmaccount.active = true;
    },

    destroyLuatchoiView: function () {
      if (this.nodeLuatchoiView) {
        this.nodeLuatchoiView.destroy();
        this.nodeLuatchoiView = null;
      }
    },
    createTaiApp: function () {
      this.nodeTaiApp = this.createView(this.prefabTaiApp);
    },
    destroyTaiApp: function () {
      if (this.nodeTaiApp) {
        this.nodeTaiApp.destroy();
        this.nodeTaiApp = null;
      }
    },
    createHotlineView: function () {
      this.nodeHotlineView = this.createView(this.prefabHotline);
    },
    destroyHotlineView: function () {
      if (this.nodeHotlineView) {
        this.nodeHotlineView.destroy();
        this.nodeHotlineView = null;
      }
    },


    createAppSafeHelpView: function () {
      this.createView(this.prefabAppSafeHelp);
    },

    createDNSHelpView: function () {
      this.createView(this.prefabDNSHelp);
    },

    createUpdateAccountView: function () {
      this.createView(this.prefabUpdateAccount);
    },

    createMoveBBView: function () {
      this.createView(this.prefabMoveBB);
    },
    destroyMoveBBView: function () {
      if (this.prefabMoveBB) this.prefabMoveBB.destroy();
    },

    createBlockBBView: function () {
      this.createView(this.prefabBlockBB);
    },
    //Tao cac game (prefab load dynamic)

    backToLobby: function () {
      this.destroyDynamicView(null);
      this.offuserguest(true);

      var sceneName = "Lobby";
      cc.director.preloadScene(sceneName, (c, t, item) => {
        cc.LobbyController.getInstance().destroyDynamicView(null);
        cc.LobbyController.getInstance().offuserguest(true);
      }, (err) => {
        cc.director.loadScene(sceneName);
      });
    },
    createDynamicView: function (gameId) {
      switch (gameId) {
        case cc.GameId.SHOOT_FISH:
          if (this.nodeSlotsView !== null) return;

          cc.RoomController.getInstance().setGameId(gameId);
          this.isLoading = true;
          var self = this;
          //Bat loading
          self.lbLoadingShootFish.node.parent.active = true;
          var percent = 0;
          //self.progressBarbanca.percent = percent / 100;



          this.bundleControl.loadPrefabGame('shootFish', 'shootFish', (finish, total) => {
            var tempPercent = parseInt((finish / total) * 100);
            if (tempPercent > percent) {
              percent = tempPercent;
            }
            self.progressBanCa.progress = finish / total;
            self.lbLoadingShootFish.string = `${parseInt((finish / total) * 100)}%`;

          }, prefab => {
            self.isLoading = false;
            self.lbLoadingShootFish.node.parent.active = false;
            self.nodeSlotsView = self.createView(prefab);
            self.activeNodeLobby(false);
          });



          break;

        case cc.GameId.EGYPT:
          if (this.nodeSlotsView !== null) return;

          cc.RoomController.getInstance().setGameId(gameId);
          this.isLoading = true;
          var self = this;
          //Bat loading
          self.lbLoadingEgypt.node.parent.active = true;

          this.bundleControl.loadPrefabGame('egypt', 'egypt', (finish, total) => {
            var tempPercent = parseInt((finish / total) * 100);
            if (tempPercent > percent) {
              percent = tempPercent;
            }
            self.progressEgypt.progress = finish / total;
            self.lbLoadingEgypt.string = `${parseInt((finish / total) * 100)}%`;

          }, prefab => {
            self.isLoading = false;
            self.lbLoadingEgypt.node.parent.active = false;
            self.nodeSlotsView = self.createView(prefab);
            self.activeNodeLobby(false);
          });

          break;

          //   case cc.GameId.THREE_KINGDOM:
          //     if (this.nodeSlotsView !== null) return;
          //
          //     cc.RoomController.getInstance().setGameId(gameId);
          //     this.isLoading = true;
          //     var self = this;
          //     //Bat loading
          //     self.lbLoadingXDTL.node.parent.active = true;
          //     var percent = 0;
          //
          //     this.bundleControl.loadPrefabGame('tq', 'tq', (finish, total) => {
          //       var tempPercent = parseInt((finish / total) * 100);
          //       if (tempPercent > percent) {
          //         percent = tempPercent;
          //       }
          //       self.progressXDTL.progress = finish / total;
          //       self.lbLoadingXDTL.string = `${parseInt((finish / total) * 100)}%`;
          //
          //     }, prefab => {
          //       self.isLoading = false;
          //       self.lbLoadingXDTL.node.parent.active = false;
          //       self.nodeSlotsView = self.createView(prefab);
          //       self.activeNodeLobby(false);
          //     });


          break;


        case cc.GameId.AQUARIUM:

          if (this.nodeSlotsView !== null) return;

          cc.RoomController.getInstance().setGameId(gameId);
          this.isLoading = true;
          //Bat loading
          this.progressBarAquarium.node.active = true;
          var percent = 0;
          this.bundleControl.loadPrefabGame('aquarium', 'aquarium', (finish, total) => {
            var tempPercent = parseInt((finish / total) * 100);
            if (tempPercent > percent) {
              percent = tempPercent;
            }
            this.progressBarAquarium.progress = finish / total;
            this.lbLoadingAquarium.string = `${parseInt((finish / total) * 100)}%`;
          }, prefab => {
            this.isLoading = false;
            this.progressBarAquarium.node.active = false;
            this.nodeSlotsView = this.createView(prefab);
            this.activeNodeLobby(false);
          });
          break;

        case cc.GameId.SONTINHTHUYTINH:
          if (this.nodeSlotsView !== null) return;

          cc.RoomController.getInstance().setGameId(gameId);
          this.isLoading = true;
          var self = this;
          //Bat loading
          self.lbLoadingSonTinhThuyTinh.node.parent.active = true;
          var percent = 0;


          this.bundleControl.loadPrefabGame('sontinhthuytinh', 'sontinhthuytinh', (finish, total) => {
            var tempPercent = parseInt((finish / total) * 100);
            if (tempPercent > percent) {
              percent = tempPercent;
            }
            self.progressBarSonTinhThuyTinh.progress = finish / total;
            self.lbLoadingSonTinhThuyTinh.string = `${parseInt((finish / total) * 100)}%`;

          }, prefab => {
            self.isLoading = false;
            self.lbLoadingSonTinhThuyTinh.node.parent.active = false;
            self.nodeSlotsView = self.createView(prefab);
            self.activeNodeLobby(false);
          });


          break;
        case cc.GameId.ANKHETRAVANG:
          if (this.nodeSlotsView !== null) return;

          cc.RoomController.getInstance().setGameId(gameId);
          this.isLoading = true;
          var self = this;
          //Bat loading
          self.lbLoadingAnKheTraVang.node.parent.active = true;
          var percent = 0;


          this.bundleControl.loadPrefabGame('natra', 'natra', (finish, total) => {
            var tempPercent = parseInt((finish / total) * 100);
            if (tempPercent > percent) {
              percent = tempPercent;
            }
            self.progressBarAnKheTraVang.progress = finish / total;
            self.lbLoadingAnKheTraVang.string = `${parseInt((finish / total) * 100)}%`;

          }, prefab => {
            self.isLoading = false;
            self.lbLoadingAnKheTraVang.node.parent.active = false;
            self.nodeSlotsView = self.createView(prefab);
            self.activeNodeLobby(false);
          });


          break;
        case cc.GameId.KHOTANGNGULONG:
          if (this.nodeSlotsView !== null) return;

          cc.RoomController.getInstance().setGameId(gameId);
          this.isLoading = true;
          var self = this;
          //Bat loading
          self.lbLoadingKhoTangNguLong.node.parent.active = true;
          var percent = 0;


          this.bundleControl.loadPrefabGame('khotangngulong', 'khotangngulong', (finish, total) => {
            var tempPercent = parseInt((finish / total) * 100);
            if (tempPercent > percent) {
              percent = tempPercent;
            }
            self.progressBarKhoTangNguLong.progress = finish / total;
            self.lbLoadingKhoTangNguLong.string = `${parseInt((finish / total) * 100)}%`;

          }, prefab => {
            self.isLoading = false;
            self.lbLoadingKhoTangNguLong.node.parent.active = false;
            self.nodeSlotsView = self.createView(prefab);
            self.activeNodeLobby(false);
          });


          break;

        case cc.GameId.DRAGON_BALL:
          if (this.nodeSlotsView !== null) return;

          cc.RoomController.getInstance().setGameId(gameId);
          this.isLoading = true;
          var self = this;
          //Bat loading
          self.lbLoadingDragonBall.node.parent.active = true;
          var percent = 0;


          this.bundleControl.loadPrefabGame('dragonball', 'dragonball', (finish, total) => {
            var tempPercent = parseInt((finish / total) * 100);
            if (tempPercent > percent) {
              percent = tempPercent;
            }
            self.progressDragonBall.progress = finish / total;
            self.lbLoadingDragonBall.string = `${parseInt((finish / total) * 100)}%`;

          }, prefab => {
            self.isLoading = false;
            self.lbLoadingDragonBall.node.parent.active = false;
            self.nodeSlotsView = self.createView(prefab);
            self.activeNodeLobby(false);
          });


          break;

        // case cc.GameId.COWBOY:
        //   if (this.nodeSlotsView !== null) return;

        //   cc.RoomController.getInstance().setGameId(gameId);
        //   this.isLoading = true;
        //   var self = this;
        //   //Bat loading
        //   self.lbLoadingCowboy.node.parent.active = true;
        //   var percent = 0;


        //   this.bundleControl.loadPrefabGame('cowboy', 'cowboy', (finish, total) => {
        //     var tempPercent = parseInt((finish / total) * 100);
        //     if (tempPercent > percent) {
        //       percent = tempPercent;
        //     }
        //     self.progressCowboy.progress = finish / total;
        //     self.lbLoadingCowboy.string = `${parseInt((finish / total) * 100)}%`;

        //   }, prefab => {
        //     self.isLoading = false;
        //     self.lbLoadingCowboy.node.parent.active = false;
        //     self.nodeSlotsView = self.createView(prefab);
        //     self.activeNodeLobby(false);
        //   });


        //   break;

        case cc.GameId.DRAGON_TIGER:
          if (this.nodeSlotsView !== null) return;

          cc.RoomController.getInstance().setGameId(gameId);
          this.isLoading = true;
          var self = this;
          //Bat loading
          self.lbLoadingDragonTiger.node.parent.active = true;
          var percent = 0;

          this.bundleControl.loadPrefabGame('dragontiger', 'dragontiger', (finish, total) => {
            var tempPercent = parseInt((finish / total) * 100);
            if (tempPercent > percent) {
              percent = tempPercent;
            }
            self.progressDragonTiger.progress = finish / total;
            self.lbLoadingDragonTiger.string = `${parseInt((finish / total) * 100)}%`;

          }, prefab => {
            self.isLoading = false;
            self.lbLoadingDragonTiger.node.parent.active = false;
            self.nodeSlotsView = self.createView(prefab);
            self.activeNodeLobby(false);
          });

          break;
        case cc.GameId.XOC_XOC:
          if (this.nodeSlotsView !== null) return;

          cc.RoomController.getInstance().setGameId(gameId);
          this.isLoading = true;
          var self = this;
          //Bat loading
          self.lbLoadingXocXoc.node.parent.active = true;
          var percent = 0;


          this.bundleControl.loadPrefabGame('xocdia', 'xocdiavip', (finish, total) => {
            var tempPercent = parseInt((finish / total) * 100);
            if (tempPercent > percent) {
              percent = tempPercent;
            }
            self.progressXocXoc.progress = finish / total;
            self.lbLoadingXocXoc.string = `${parseInt((finish / total) * 100)}%`;

          }, prefab => {
            self.isLoading = false;
            self.lbLoadingXocXoc.node.parent.active = false;
            self.nodeSlotsView = self.createView(prefab);
            self.activeNodeLobby(false);
            //	self.activeNodeTopBar(true);
          });

          break;
        case cc.GameId.XOCDIA:
          if (this.nodeSlotsView !== null) return;

          cc.RoomController.getInstance().setGameId(gameId);
          this.isLoading = true;
          var self = this;
          //Bat loading
          self.lbLoadingXocXocTL.node.parent.active = true;
          var percent = 0;


          this.bundleControl.loadPrefabGame('XocdiaTL', 'XocdiaTL', (finish, total) => {
            var tempPercent = parseInt((finish / total) * 100);
            if (tempPercent > percent) {
              percent = tempPercent;
            }
            self.progressXocXocTL.progress = finish / total;
            self.lbLoadingXocXocTL.string = `${parseInt((finish / total) * 100)}%`;

          }, prefab => {
            self.isLoading = false;
            self.lbLoadingXocXocTL.node.parent.active = false;
            self.nodeSlotsView = self.createView(prefab);
            self.activeNodeLobby(false);
          });

          break;

        // case cc.GameId.XOC_DIA_LIVESTREAM:
        //   if (this.nodeSlotsView !== null) return;

        //   cc.RoomController.getInstance().setGameId(gameId);
        //   this.isLoading = true;
        //   var self = this;
        //   //Bat loading
        //   self.lbLoadingXocDiaLivestream.node.parent.active = true;
        //   var percent = 0;


        //   this.bundleControl.loadPrefabGame('xocdiaLivestream', 'xocdiaLivestream', (finish, total) => {
        //     var tempPercent = parseInt((finish / total) * 100);
        //     if (tempPercent > percent) {
        //       percent = tempPercent;
        //     }
        //     self.progressXoDiaLivestream.progress = finish / total;
        //     self.lbLoadingXocDiaLivestream.string = `${parseInt((finish / total) * 100)}%`;

        //   }, prefab => {
        //     self.isLoading = false;
        //     self.lbLoadingXocDiaLivestream.node.parent.active = false;
        //     self.nodeSlotsView = self.createView(prefab);
        //     self.activeNodeLobby(false);
        //   });

        //   break;

        case cc.GameId.TAI_XIU:
          //kiem tra da tao roi -> ko tao them
          if (this.nodeTaiXiu !== null) return;

          this.isLoading = true;
          var self = this;
          //Bat loading
          self.lbLoadingTaiXiu.node.parent.active = true;
          var percent = 0;





          this.bundleControl.loadPrefabGame('taixiu', 'taixiu', (finish, total) => {
            var tempPercent = parseInt((finish / total) * 100);
            if (tempPercent > percent) {
              percent = tempPercent;
            }
            self.progressTaiXiu.progress = finish / total;
            self.lbLoadingTaiXiu.string = `${parseInt((finish / total) * 100)}%`;

          }, prefab => {
            self.isLoading = false;
            self.lbLoadingTaiXiu.node.parent.active = false;
            self.nodeTaiXiu = self.createView(prefab);
          });

          break;
        case cc.GameId.TAI_XIU_MD5:
          //kiem tra da tao roi -> ko tao them
          if (this.nodeTaiXiuMd5 !== null) return;

          this.isLoading = true;
          var self = this;
          //Bat loading
          self.lbLoadingTaiXiuMd5.node.parent.active = true;
          var percent = 0;


          this.bundleControl.loadPrefabGame('taixiumd5', 'taixiumd5', (finish, total) => {
            var tempPercent = parseInt((finish / total) * 100);
            if (tempPercent > percent) {
              percent = tempPercent;
            }
            self.progressTaiXiuMd5.progress = finish / total;
            self.lbLoadingTaiXiuMd5.string = `${parseInt((finish / total) * 100)}%`;

          }, prefab => {
            self.isLoading = false;
            self.lbLoadingTaiXiuMd5.node.parent.active = false;
            self.nodeTaiXiuMd5 = self.createView(prefab);
          });
          break;
        case cc.GameId.TAI_XIU_LIVESTREAM:
          //kiem tra da tao roi -> ko tao them
          if (this.nodeTaiXiuLivestream !== null) return;

          this.isLoading = true;
          var self = this;
          //Bat loading
          self.lbLoadingTaiXiuLivestream.node.parent.active = true;
          var percent = 0;


          this.bundleControl.loadPrefabGame('taixiuLivestream', 'taixiuLivestream', (finish, total) => {
            var tempPercent = parseInt((finish / total) * 100);
            if (tempPercent > percent) {
              percent = tempPercent;
            }
            self.progressTaiXiuLivestream.progress = finish / total;
            self.lbLoadingTaiXiuLivestream.string = `${parseInt((finish / total) * 100)}%`;

          }, prefab => {
            self.isLoading = false;
            self.lbLoadingTaiXiuLivestream.node.parent.active = false;
            self.nodeTaiXiuLivestream = self.createView(prefab);
          });
          break;
        case cc.GameId.TAI_XIU_SIEU_TOC:
          //kiem tra da tao roi -> ko tao them
          if (this.nodeTaiXiuSieuToc !== null) return;

          this.isLoading = true;
          var self = this;
          //Bat loading
          self.lbLoadingTaiXiuSieuToc.node.parent.active = true;
          var percent = 0;
          cc.loader.loadRes(
            "taixiusieutoc/prefabs/taiXiuSieuTocView",
            function (a, b, c) {
              var tempPercent = Math.round((100 * a) / b);

              //dam bao cho % ko bi lui lai (do quy trinh dem asset khi load)
              if (tempPercent > percent) {
                percent = tempPercent;
              }
              self.progressTaiXiuSieuToc.progress = a / b;
              self.lbLoadingTaiXiuSieuToc.string = `${parseInt((a / b) * 100)}%`;
            },
            function (err, prefab) {
              //Load xong
              self.isLoading = false;
              //Tat loading
              self.lbLoadingTaiXiuSieuToc.node.parent.active = false;
              //Tao game
              self.nodeTaiXiuSieuToc = self.createView(prefab);
            }
          );
          break;
        case cc.GameId.SICBO:
          //kiem tra da tao roi -> ko tao them
          if (this.nodeSicbo !== null) return;

          this.isLoading = true;
          var self = this;
          //Bat loading
          self.lbLoadingSicbo.node.parent.active = true;
          var percent = 0;

          this.bundleControl.loadPrefabGame('sicbo', 'SicboView', (finish, total) => {
            var tempPercent = parseInt((finish / total) * 100);
            if (tempPercent > percent) {
              percent = tempPercent;
            }
            self.progressSicbo.progress = finish / total;
            self.lbLoadingSicbo.string = `${parseInt((finish / total) * 100)}%`;

          }, prefab => {
            self.isLoading = false;
            self.lbLoadingSicbo.node.parent.active = false;
            this.nodeSicbo = self.createView(prefab);
            // self.activeNodeLobby(false);
          });



          break;

        case cc.GameId.MINI_POKER:
          //kiem tra da tao roi -> ko tao them
          if (this.nodeMiniPoker !== null) return;

          this.isLoading = true;
          var self = this;
          var percent = 0;
          //Bat loading
          self.lbLoadingMiniPoker.node.parent.active = true;
          // self.progressBar.percent = percent / 100;


          this.bundleControl.loadPrefabGame('minipoker', 'minipoker', (finish, total) => {
            var tempPercent = parseInt((finish / total) * 100);
            if (tempPercent > percent) {
              percent = tempPercent;
            }
            self.progressMiniPoker.progress = finish / total;
            self.lbLoadingMiniPoker.string = `${parseInt((finish / total) * 100)}%`;

          }, prefab => {
            self.isLoading = false;
            self.lbLoadingMiniPoker.node.parent.active = false;
            self.nodeMiniPoker = self.createView(prefab);
          });


          break;

        case cc.GameId.SEVEN77:
          //kiem tra da tao roi -> ko tao them
          if (this.node777 !== null) return;

          this.isLoading = true;
          var self = this;
          //Bat loading
          self.lbLoading777.node.parent.active = true;
          var percent = 0;



          this.bundleControl.loadPrefabGame('777', '777', (finish, total) => {
            var tempPercent = parseInt((finish / total) * 100);
            if (tempPercent > percent) {
              percent = tempPercent;
            }
            self.progress777.progress = finish / total;
            self.lbLoading777.string = `${parseInt((finish / total) * 100)}%`;

          }, prefab => {
            self.isLoading = false;
            self.lbLoading777.node.parent.active = false;
            self.node777 = self.createView(prefab);
          });

          break;

        case cc.GameId.BLOCK_BUSTER:
          //kiem tra da tao roi -> ko tao them
          if (this.nodeTQ !== null) return;

          this.isLoading = true;
          var self = this;
          //Bat loading
          self.lbLoadingTQ.node.parent.active = true;
          var percent = 0;
          this.bundleControl.loadPrefabGame('tq', 'tq', (finish, total) => {
            var tempPercent = parseInt((finish / total) * 100);
            if (tempPercent > percent) {
              percent = tempPercent;
            }
            self.progressTQ.progress = finish / total;
            self.lbLoadingTQ.string = `${parseInt((finish / total) * 100)}%`;

          }, prefab => {
            self.isLoading = false;
            self.lbLoadingTQ.node.parent.active = false;
            self.nodeTQ = self.createView(prefab);
          });

          break;

        //CARD GAME
        case cc.GameId.POKER_TEXAS:
          if (this.nodeSlotsView !== null) return;

          cc.RoomController.getInstance().setGameId(gameId);
          this.isLoading = true;
          var self = this;
          //Bat loading
          self.lbLoadingPoker.node.parent.active = true;
          var percent = 0;


          this.bundleControl.loadPrefabGame('poker', 'poker', (finish, total) => {
            var tempPercent = parseInt((finish / total) * 100);
            if (tempPercent > percent) {
              percent = tempPercent;
            }
            self.progressPoker.progress = finish / total;
            self.lbLoadingPoker.string = `${parseInt((finish / total) * 100)}%`;

          }, prefab => {
            self.isLoading = false;
            self.lbLoadingPoker.node.parent.active = false;
            self.nodeSlotsView = self.createView(prefab);
            self.activeNodeLobby(false);
          });

          break;

        case cc.GameId.BA_CAY:
          if (this.nodeSlotsView !== null) return;

          cc.RoomController.getInstance().setGameId(gameId);
          this.isLoading = true;
          var self = this;
          //Bat loading
          self.lbLoadingBACAY.node.parent.active = true;
          var percent = 0;


          this.bundleControl.loadPrefabGame('3cay', '3cay', (finish, total) => {
            var tempPercent = parseInt((finish / total) * 100);
            if (tempPercent > percent) {
              percent = tempPercent;
            }
            self.progressBACAY.progress = finish / total;
            self.lbLoadingBACAY.string = `${parseInt((finish / total) * 100)}%`;

          }, prefab => {
            self.isLoading = false;
            self.lbLoadingBACAY.node.parent.active = false;
            self.nodeSlotsView = self.createView(prefab);
            self.activeNodeLobby(false);
          });

          break;



        case cc.GameId.TIEN_LEN_MN:
          if (this.nodeSlotsView !== null) return;

          cc.RoomController.getInstance().setGameId(gameId);
          this.isLoading = true;
          var self = this;
          //Bat loading
          self.lbLoadingTLMN.node.parent.active = true;
          var percent = 0;


          this.bundleControl.loadPrefabGame('tienlenMN', 'tienlenMN', (finish, total) => {
            var tempPercent = parseInt((finish / total) * 100);
            if (tempPercent > percent) {
              percent = tempPercent;
            }
            self.progressTLMN.progress = finish / total;
            self.lbLoadingTLMN.string = `${parseInt((finish / total) * 100)}%`;

          }, prefab => {
            self.isLoading = false;
            self.lbLoadingTLMN.node.parent.active = false;
            self.nodeSlotsView = self.createView(prefab);
            self.activeNodeLobby(false);
          });
          break;

        case cc.GameId.TIEN_LEN_MN_SOLO:
          if (this.nodeSlotsView !== null) return;

          cc.RoomController.getInstance().setGameId(gameId);
          this.isLoading = true;
          var self = this;
          //Bat loading
          self.lbLoadingTLMNSolo.node.parent.active = true;
          var percent = 0;

          this.bundleControl.loadPrefabGame('tienlenMNSoLo', 'tienlenMNSoLo', (finish, total) => {
            var tempPercent = parseInt((finish / total) * 100);
            if (tempPercent > percent) {
              percent = tempPercent;
            }
            self.progressTLMNSolo.progress = finish / total;
            self.lbLoadingTLMNSolo.string = `${parseInt((finish / total) * 100)}%`;

          }, prefab => {
            self.isLoading = false;
            self.lbLoadingTLMNSolo.node.parent.active = false;
            self.nodeSlotsView = self.createView(prefab);
            self.activeNodeLobby(false);
          });

          break;

        case cc.GameId.MAU_BINH:
          if (this.nodeSlotsView !== null) return;

          cc.RoomController.getInstance().setGameId(gameId);
          this.isLoading = true;
          var self = this;
          //Bat loading
          self.lbLoadingMB.node.parent.active = true;
          var percent = 0;


          this.bundleControl.loadPrefabGame('maubinh', 'maubinh', (finish, total) => {
            var tempPercent = parseInt((finish / total) * 100);
            if (tempPercent > percent) {
              percent = tempPercent;
            }
            self.progressMB.progress = finish / total;
            self.lbLoadingMB.string = `${parseInt((finish / total) * 100)}%`;

          }, prefab => {
            self.isLoading = false;
            self.lbLoadingMB.node.parent.active = false;
            self.nodeSlotsView = self.createView(prefab);
            self.activeNodeLobby(false);
          });
          break;

        case cc.GameId.BACCARAT:
          if (this.nodeSlotsView !== null) return;

          cc.RoomController.getInstance().setGameId(gameId);
          this.isLoading = true;
          var self = this;
          //Bat loading
          self.lbLoadingBaccarat.node.parent.active = true;
          var percent = 0;


          this.bundleControl.loadPrefabGame('bacarat', 'bacarat', (finish, total) => {
            var tempPercent = parseInt((finish / total) * 100);
            if (tempPercent > percent) {
              percent = tempPercent;
            }
            self.progressBaccarat.progress = finish / total;
            self.lbLoadingBaccarat.string = `${parseInt((finish / total) * 100)}%`;

          }, prefab => {
            self.isLoading = false;
            self.lbLoadingBaccarat.node.parent.active = false;
            self.nodeSlotsView = self.createView(prefab);
            self.activeNodeLobby(false);
          });

          break;
        case cc.GameId.BAUCUA:
          if (this.nodeSlotsView !== null) return;

          cc.RoomController.getInstance().setGameId(gameId);
          this.isLoading = true;
          var self = this;
          //Bat loading
          self.lbLoadingBauCua.node.parent.active = true;
          var percent = 0;


          this.bundleControl.loadPrefabGame('baucua', 'baucua', (finish, total) => {
            var tempPercent = parseInt((finish / total) * 100);
            if (tempPercent > percent) {
              percent = tempPercent;
            }
            self.progressBauCua.progress = finish / total;
            self.lbLoadingBauCua.string = `${parseInt((finish / total) * 100)}%`;

          }, prefab => {
            self.isLoading = false;
            self.lbLoadingBauCua.node.parent.active = false;
            self.nodeSlotsView = self.createView(prefab);
            self.activeNodeLobby(false);
          });

          break;

        case cc.GameId.LODE:
          if (this.nodeSlotsView !== null) return;

          cc.RoomController.getInstance().setGameId(gameId);
          this.isLoading = true;
          var self = this;

          //Bat loading
          self.lbLoadingLoDe.node.parent.active = true;
          var percent = 0;

          this.bundleControl.loadPrefabGame('lode', 'lode', (finish, total) => {
            var tempPercent = parseInt((finish / total) * 100);
            if (tempPercent > percent) {
              percent = tempPercent;
            }
            self.progressLoDe.progress = finish / total;
            self.lbLoadingLoDe.string = `${parseInt((finish / total) * 100)}%`;

          }, prefab => {
            self.isLoading = false;
            self.lbLoadingLoDe.node.parent.active = false;
            self.nodeSlotsView = self.createView(prefab);
            self.activeNodeLobby(false);
          });

          break;
      }
    },

    destroyDynamicView: function (gameId) {
      switch (gameId) {
        case cc.GameId.EVENT_TREASURE:
          if (this.nodeTreasureView) {
            this.nodeTreasureView.destroy();
            this.nodeTreasureView = null;
          }

          if (this.nodeTreasureGiftView) {
            this.nodeTreasureGiftView.destroy();
            this.nodeTreasureGiftView = null;
          }

          if (this.nodeBuyCarrotView) {
            this.nodeBuyCarrotView.destroy();
            this.nodeBuyCarrotView = null;
          }
          break;
        case cc.GameId.TAI_XIU:
          if (this.nodeTaiXiu) {
            this.nodeTaiXiu.destroy();
            this.nodeTaiXiu = null;
          }
          break;
        case cc.GameId.TAI_XIU_MD5:
          if (this.nodeTaiXiuMd5) {
            this.nodeTaiXiuMd5.destroy();
            this.nodeTaiXiuMd5 = null;
          }
          break;
        // case cc.GameId.TAI_XIU_LIVESTREAM:
        //   if (this.nodeTaiXiuLivestream) {
        //     this.nodeTaiXiuLivestream.destroy();
        //     this.nodeTaiXiuLivestream = null;
        //   }
        //   break;
        case cc.GameId.TAI_XIU_SIEU_TOC:
          if (this.nodeTaiXiuSieuToc) {
            this.nodeTaiXiuSieuToc.destroy();
            this.nodeTaiXiuSieuToc = null;
          }
          break;
        case cc.GameId.SICBO:
          if (this.nodeSicbo) {
            this.nodeSicbo.destroy();
            this.nodeSicbo = null;
          }
          break;
        case cc.GameId.MINI_POKER:
          if (this.nodeMiniPoker) {
            this.nodeMiniPoker.destroy();
            this.nodeMiniPoker = null;
          }
          break;
        case cc.GameId.SEVEN77:
          if (this.node777) {
            this.node777.destroy();
            this.node777 = null;
          }
          break;
        case cc.GameId.BLOCK_BUSTER:
          if (this.nodeTQ) {
            this.nodeTQ.destroy();
            this.nodeTQ = null;
          }
          break;
        case cc.GameId.LUCKY_WILD:
          if (this.nodeLW) {
            this.nodeLW.destroy();
            this.nodeLW = null;
          }
          break;
        case cc.GameId.ESPORTS:
          if (this.nodeEsport) {
            this.nodeEsport.destroy();
            this.nodeEsport = null;
          }
          break;
        default:
          this.activeNodeTopBar(true);
          //bat lai cac node o lobby
          this.activeNodeLobby(true);

          //cc.BannerController.getInstance().switchPage();

          //mac dinh se là cac game slots
          if (this.nodeSlotsView) {
            this.nodeSlotsView.destroy();
            this.nodeSlotsView = null;
          }

          if (this.nodeEventView) {
            this.nodeEventView.destroy();
            this.nodeEventView = null;
          }

          if (this.nodeEventViewTopVP) {
            this.nodeEventViewTopVP.destroy();
            this.nodeEventViewTopVP = null;
          }
          if (this.nodeMissionView) {
            this.nodeMissionView.destroy();
            this.nodeMissionView = null;
          }

          break;
      }
      cc.LobbyController.getInstance().refreshAccountInfo();
    },

    destroyAllMiniGameView: function () {
      this.destroyDynamicView(cc.GameId.TAI_XIU);
      this.destroyDynamicView(cc.GameId.TAI_XIU_MD5);
      // this.destroyDynamicView(cc.GameId.TAI_XIU_LIVESTREAM);
      // this.destroyDynamicView(cc.GameId.TAI_XIU_SIEU_TOC);
      this.destroyDynamicView(cc.GameId.SICBO);
      this.destroyDynamicView(cc.GameId.MINI_POKER);
      this.destroyDynamicView(cc.GameId.SEVEN77);
      this.destroyDynamicView(cc.GameId.BLOCK_BUSTER);
      this.destroyDynamicView(cc.GameId.LUCKY_WILD);

      this.destroyDynamicView(null);
    },

    createView: function (prefab, posY) {
      var nodeView = cc.instantiate(prefab);
      nodeView.parent = this.node;
      if (posY) {
        nodeView.setPosition(0, posY);
      } else {
        nodeView.setPosition(0, 0);
      }

      return nodeView;
    },

    loginSuccess: function () {

      let self = this;
      // this.nodeguest.active = false;
      let animation = this.nodeguest.getComponent(cc.Animation);
      animation.wrapMode = cc.WrapMode.Normal;
      // animation.on('finished', function () {
      //   cc.log('show UI Name, Ava');
      //   self.nodemember.active = true;
      // });
      animation.play('closeGroupLogin');

      setTimeout(function () {
        this.nodeguest1.active = false;
        this.nodemember.active = true;
        this.nodemember1.active = true;
        let animation1 = this.nodemember.getComponent(cc.Animation);
        animation1.wrapMode = cc.WrapMode.Normal;
        animation1.play('openGroupMember');
        // Hien thi layout UI Name, Ava
      }.bind(this), 330);

      // this.nodemember.active = true;
      cc.OneSignalController.getInstance().sendTag(
        "AccountID",
        cc.LoginController.getInstance().getUserId()
      );
      cc.OneSignalController.getInstance().sendTag(
        "AccountName",
        cc.LoginController.getInstance().getNickname()
      );

      //cap nhat lai trang thai
      cc.LoginController.getInstance().setLoginState(true);
      //hien UI NickName + avatar
      // cc.LobbyController.getInstance().updateUILogin(false);
      //open hub portal
      cc.GameController.getInstance().portalNegotiate();

      cc.LobbyController.getInstance().topBarUpdateInfo();

      if (!this._reloadInfoInterval) {
        this._reloadInfoInterval = setInterval(() => {
          if (cc.LoginController.getInstance().checkLogin()) {
            this.refreshAccountInfo();
          }
        }, 3000);
      }

      //Kiem tra thu chua doc
      cc.LobbyController.getInstance().getMailUnRead();

      //Bat huong dan appSafe sau khi Login + chua tich hopj AppSafe
      // var loginResponse = cc.LoginController.getInstance().getLoginResponse();


      // //#KingViet
      // if (cc.Config.getInstance().getDomainVK().includes(netConfig.HOST)) {
      //     cc.AccountController.getInstance().setAppSafeSatus(false);
      //     var checkSafeLinkAccountCommand = new cc.CheckSafeLinkAccountCommand;
      //     checkSafeLinkAccountCommand.execute();
      // } else {
      //
      //
      //
      // }

      // cc.LobbyController.getInstance().createDNSHelpView();

      // var checkHaveGiftcodeCommand = new cc.CheckHaveGiftcodeCommand;
      // checkHaveGiftcodeCommand.execute();

      // show sieu xe
      // if (this.nodeX2Popup == null)
      //   cc.LobbyController.getInstance().createX2PopupView(); // comment


    },

    // hàm này sẽ được gọi khi có sự kiện từ server gửi về

    onDestroy: function () {
      if (this._reloadInfoInterval) {
        clearInterval(this._reloadInfoInterval);
        this._reloadInfoInterval = null;
      }
    },

    //EVENT SAN KHO BAU
    checkHaveDailyBonus: function () {
      var treasureGetCarrotNameKnownCommand =
        new cc.TreasureGetCarrotNameKnownCommand();
      treasureGetCarrotNameKnownCommand.execute(this);
    },

    onTreasureGetCarrotNameKnownResponse: function (response) {
      if (response !== null)
        cc.TreasureController.getInstance().setIsDailyBonus(response.IsInDay); //= true la nhan roi

      //chua nhan thi moi hien
      if (response !== null && !response.IsInDay) {
        cc.LobbyController.getInstance().createCarrotDailyBonusView();
      }
    },

    joinGame: function (gameId) {
      if (cc.LoginController.getInstance().checkLogin()) {
        if (this.isLoading) return;

        if (gameId === undefined) {
          // || gameId === cc.GameId.BLOCK_BUSTER
          //cc.PopupController.getInstance().showMessage('Sắp ra mắt!');
          cc.PopupController.getInstance().showMessage("Sắp ra mắt!");
          return;
        }



        switch (gameId.toString()) {
          case cc.GameId.SHOOT_FISH:
            this.createDynamicView(cc.GameId.SHOOT_FISH);
            break;
          case cc.GameId.ESPORTS:
            this.createDynamicView(cc.GameId.ESPORTS);
            break;
          //Game slots chinh
          case cc.GameId.EGYPT:
            this.createDynamicView(cc.GameId.EGYPT);
            break;
          case cc.GameId.THREE_KINGDOM:
            this.createDynamicView(cc.GameId.THREE_KINGDOM);
            break;
          case cc.GameId.AQUARIUM:
            this.createDynamicView(cc.GameId.AQUARIUM);
            break;
          case cc.GameId.SONTINHTHUYTINH:
            this.createDynamicView(cc.GameId.SONTINHTHUYTINH);
            break;
          case cc.GameId.ANKHETRAVANG:
            this.createDynamicView(cc.GameId.ANKHETRAVANG);
            break;
          case cc.GameId.KHOTANGNGULONG:
            this.createDynamicView(cc.GameId.KHOTANGNGULONG);
            break;
          case cc.GameId.DRAGON_BALL:
            this.createDynamicView(cc.GameId.DRAGON_BALL);
            break;
          // case cc.GameId.BUM_BUM:
          //   this.createDynamicView(cc.GameId.BUM_BUM);
          //   break;
          // case cc.GameId.COWBOY:
          //   this.createDynamicView(cc.GameId.COWBOY);
          //   break;
          // case cc.GameId.THUONG_HAI:
          //   this.createDynamicView(cc.GameId.THUONG_HAI);
          //   break;
          // case cc.GameId.GAINHAY:
          //   this.createDynamicView(cc.GameId.GAINHAY);
          //   break;
          //Game mini full màn hình
          case cc.GameId.BACCARAT:
            this.createDynamicView(cc.GameId.BACCARAT);
            break;
          case cc.GameId.MONKEY:
            this.createDynamicView(cc.GameId.MONKEY);
            break;
          case cc.GameId.DRAGON_TIGER:
            this.createDynamicView(cc.GameId.DRAGON_TIGER);
            break;
          case cc.GameId.BAUCUA:
            this.createDynamicView(cc.GameId.BAUCUA);
            break;
          //CARD GAME
          case cc.GameId.XOC_XOC:
            this.createDynamicView(cc.GameId.XOC_XOC);
            break;
          case cc.GameId.XOCDIA:
            this.createDynamicView(cc.GameId.XOCDIA);
            break;
          // case cc.GameId.XOC_DIA_LIVESTREAM:
          //   this.createDynamicView(cc.GameId.XOC_DIA_LIVESTREAM);
          //   break;
          case cc.GameId.POKER_TEXAS:
          case cc.GameId.BA_CAY:
          case cc.GameId.TIEN_LEN_MN:
          case cc.GameId.TIEN_LEN_MN_SOLO:
            if (cc.BalanceController.getInstance().getBalance() < 10000) {
              cc.PopupController.getInstance().showMessage(
                "Bạn không đủ tiền để vào phòng. Tối thiểu cần 10.000"
              );
              return;
            } else {
              this.createDynamicView(gameId.toString());
            }
            break;

          case cc.GameId.MAU_BINH:
            if (cc.BalanceController.getInstance().getBalance() < 30000) {
              cc.PopupController.getInstance().showMessage(
                "Bạn không đủ tiền để vào phòng. Tối thiểu cần 30.000"
              );
              return;
            } else {
              this.createDynamicView(gameId.toString());
            }
            break;
          //MINI game
          case cc.GameId.TAI_XIU:
            this.isMiniGame = true;
            this.createDynamicView(cc.GameId.TAI_XIU);
            break;
          case cc.GameId.TAI_XIU_MD5:
            // this.isMiniGame = true;
            this.createDynamicView(cc.GameId.TAI_XIU_MD5);
            break;
          // case cc.GameId.TAI_XIU_LIVESTREAM:
          //   // this.isMiniGame = true;
          //   this.createDynamicView(cc.GameId.TAI_XIU_LIVESTREAM);
          //   break;
          // case cc.GameId.TAI_XIU_SIEU_TOC:
          //   // this.isMiniGame = true;
          //   this.createDynamicView(cc.GameId.TAI_XIU_SIEU_TOC);
          //   break;
          case cc.GameId.SICBO:
            // this.isMiniGame = true;
            this.createDynamicView(cc.GameId.SICBO);
            break;
          case cc.GameId.MINI_POKER:
            this.isMiniGame = true;
            this.createDynamicView(cc.GameId.MINI_POKER);
            break;
          case cc.GameId.SEVEN77:
            this.isMiniGame = true;
            this.createDynamicView(cc.GameId.SEVEN77);
            break;
          case cc.GameId.BLOCK_BUSTER:
            this.isMiniGame = true;
            this.createDynamicView(cc.GameId.BLOCK_BUSTER);
            break;
          case cc.GameId.LUCKY_WILD:
            // this.isMiniGame = true;
            this.createDynamicView(cc.GameId.LUCKY_WILD);
            break;

          case cc.GameId.LODE:
            this.createDynamicView(cc.GameId.LODE);
            break;
          case cc.GameId.VIETLOT:
            this.createDynamicView(cc.GameId.VIETLOT);
            break;
          case "100":
            cc.PopupController.getInstance().showMessage("Sắp ra mắt");
            break;
          case "101":
            cc.PopupController.getInstance().showMessage("Sắp ra mắt");
            break;
        }
      }
    },

    gamebaitri: function () {
      cc.PopupController.getInstance().showMessage("Sắp ra mắt!");
    },

    gamebaotri: function () {
      cc.PopupController.getInstance().showMessage("Game bảo trì!");
    },

    refreshAccountInfo: function () {
      var getAccountInfoCommand = new cc.GetAccountInfoCommand();
      getAccountInfoCommand.execute(this);
    },

    activeNodeLobby: function (enable) {
      if (enable) {
        this.nodeguest.active = true;
        this.nodeguest1.active = true;
        this.nodemember.active = false;
        this.nodemember1.active = false;
        this.activeNodeTopBar(false);
        this.playAudioBg();

      } else {
        this.nodeguest.active = false; // false
        this.nodeguest1.active = false;

        this.nodemember.active = true;
        this.nodemember1.active = true;
        this.audioBg.stop();
        // tat popup jackpot
        cc.TopController.getInstance().hideJackpot();
      }
      this.nodeLobbys.forEach(function (nodeLobby) {
        nodeLobby.active = enable;
      });
      cc.LobbyController.getInstance().setLobbyActive(enable);
    },

    //  activeNodeTopBar: function (enable) {
    //    this.nodeTopBar.active = enable;
    //  //  this.nodeSetting.active = enable;
    //    this.nodeTopBar.getComponent(cc.TopBarView).isCardGame = enable;
    //    if (enable) {
    //      this.nodeTopBar.zIndex = cc.NoteDepth.TOP_BAR;
    //      this.refreshAccountInfo();
    //    } else {
    //      this.nodeTopBar.zIndex = cc.NoteDepth.TOP_BAR;
    //    }
    //  },
    activeNodeTopBar: function (enable) {
      this.nodeTopBar.active = enable;
      this.nodeSetting.active = enable;
      this.nodeTopBar.getComponent(cc.TopBarView).isCardGame = enable;
      if (enable) {
        this.nodeTopBar.zIndex = cc.NoteDepth.TOP_BAR_CARD_GAME;
        this.refreshAccountInfo();
      } else {
        this.nodeTopBar.zIndex = cc.NoteDepth.TOP_BAR;
      }
    },

    //response
    onGetAccountInfoResponse: function (response) {
      if (response !== null) {
        cc.LoginController.getInstance().setLoginResponse(response.AccountInfo);
        cc.LoginController.getInstance().setNextVPResponse(response.NextVIP);
        cc.LoginController.getInstance().setTopVPResponse(response.TopVP);
      }
      cc.LobbyController.getInstance().topBarUpdateInfo();

      if (response.PhoneNumber != '') {
        this.btnconfirmaccount.active = false;
      } else {
        this.btnconfirmaccount.active = true;
      }
    },

    // checkVQMMInfo: function () {
    //  var vqmmGetInfoCommand = new cc.VQMMGetInfoCommand;
    //  vqmmGetInfoCommand.execute(this);
    //  },

    // onVQMMGetInfoResponse: function (response) {
    //{"Quantity":1,"IsOpen":false,"Response":0}
    //   if (response !== null && response.Quantity > 0 && response.IsOpen) {
    //     this.createVQMMView();
    //  }
    //  },

    joinGameClicked: function (event, data) {
      if (this.joinGameSound) this.joinGameSound.play();
      if (cc.LoginController.getInstance().checkLogin()) {
        if (this.isClickSelectGame < 1) {
          this.isReloadNodeSelectGame = true;
        } else this.isReloadNodeSelectGame = false;
        this.joinGame(data);
        cc.DDNA.getInstance().uiInteraction(
          cc.DDNAUILocation.PORTAL,
          cc.DDNA.getInstance().getGameById(data.toString()),
          cc.DDNAUIType.BUTTON
        );
      }
    },

    setIsAudioBg: function () {
      this.IsOnAudioBg = !this.IsOnAudioBg;
      cc.Tool.getInstance().setItem("@onAudioBg", this.IsOnAudioBg);
      if (this.IsOnAudioBg) this.audioBg.play();
      else this.audioBg.stop();
    },

    playAudioBg: function () {
      if (this.IsOnAudioBg) {
        this.audioBg.play();
      } else {
        this.audioBg.stop();
      }
    },

    openHotro: function () {
      cc.sys.openURL(cc.Config.getInstance().liveChat());
    },
    openWebsite: function () {
      console.log("hi");
    },

    selectGames: function (i) {

      this.isClickSelectGame = i;

      if (i == 0) {
        this.nodeAllGame.children.forEach(n => {
          n.active = true;
        })
      }
      if (i == 1) {
        this.nodeAllGame.children.forEach(n => {
          n.active = false;
        })
        this.nodeMiniGames.forEach(n => {
          n.active = true;
        })
      }
      if (i == 2) {
        this.nodeAllGame.children.forEach(n => {
          n.active = false;
        })
        this.nodeSlotGames.forEach(n => {
          n.active = true;
        })
      }
      if (i == 3) {
        this.nodeAllGame.children.forEach(n => {
          n.active = false;
        })
        this.nodeGameBai.forEach(n => {
          n.active = true;
        })
      }
    },

    showGroupLoginWithAnimation: function (isShow) {
      let self = this;
      let animation = this.nodeguest.getComponent(cc.Animation);
      if (isShow) {
        animation.wrapMode = cc.WrapMode.Normal; //Reverse
      } else animation.wrapMode = cc.WrapMode.Normal;
      animation.play('openGroupLogin');
    }

  });
}.call(this));
