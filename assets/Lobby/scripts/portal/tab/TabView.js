/**
 * Created by Nofear on 3/14/2019.
 */

(function () {
  cc.TabView = cc.Class({
    extends: cc.Component,
    properties: {
      nodeContent: cc.Node,

      nodeMinis: [cc.Node],
      nodeCards: [cc.Node],
      nodeSlots: [cc.Node],
      nodeAlls: [cc.Node],

      btnAll: cc.Button,
      btnSlots: cc.Button,
      btnMini: cc.Button,
      btnCard: cc.Button,
      tabAll: cc.Node,
      tabSlots: cc.Node,
      tabNull: cc.Node,
      tabGameBai: cc.Node,
      tabGameQuay: cc.Node,
      contentScroll: cc.ScrollView,
    },
    onLoad: function () {
      this.nodeAlls.forEach(function (node) {
        if (node) node.active = true;
      });
      this.btnAll.interactable = false;
      this.tabAll.setSiblingIndex(0);
      this.tabSlots.setSiblingIndex(1);
      this.tabNull.setSiblingIndex(2);
      this.tabGameBai.setSiblingIndex(3);
      this.tabGameQuay.setSiblingIndex(4);
      this.contentScroll.content.position = new cc.Vec3(0,0,0);
      this.contentScroll.scrollToPercentHorizontal(0, .8);

    },
    selectTabClicked: function (event, data) {
      this.btnAll.interactable = true;
      this.btnSlots.interactable = true;
      this.btnMini.interactable = true;
      this.btnCard.interactable = true;

      // switch (data.toString()) {
      //   case "all":
      //     this.nodeAlls.forEach(function (node) {
      //       if (node) node.active = true;
      //     });
      //     this.btnAll.interactable = false;
      //     break;
      //   case "card":
      //     this.nodeAlls.forEach(function (node) {
      //       if (node) node.active = false;
      //     });
      //     this.nodeCards.forEach(function (node) {
      //       if (node) node.active = true;
      //     });
      //     this.btnCard.interactable = false;
      //     break;
      //   case "slots":
      //     this.nodeAlls.forEach(function (node) {
      //       if (node) node.active = false;
      //     });
      //     this.nodeSlots.forEach(function (node) {
      //       if (node) node.active = true;
      //     });
      //     this.btnSlots.interactable = false;
      //     break;
      //   case "mini":
      //     this.nodeAlls.forEach(function (node) {
      //       if (node) node.active = false;
      //     });
      //     this.nodeMinis.forEach(function (node) {
      //       if (node) node.active = true;
      //     });
      //     this.btnMini.interactable = false;
      //     break;
      // }

      switch (data.toString()) {
        case "all":
          this.btnAll.interactable = false;
          this.tabAll.setSiblingIndex(0);
          this.tabSlots.setSiblingIndex(1);
          this.tabNull.setSiblingIndex(2);
          this.tabGameBai.setSiblingIndex(3);
          this.tabGameQuay.setSiblingIndex(4);
          this.contentScroll.content.position = new cc.Vec3(0,0,0);
          this.contentScroll.scrollToPercentHorizontal(0, .8);
          break;
        case "card":
          this.nodeCards.forEach(function (node) {
            if (node) node.active = true;
          });
          this.btnCard.interactable = false;
          this.tabAll.setSiblingIndex(2);
          this.tabSlots.setSiblingIndex(3);
          this.tabNull.setSiblingIndex(4);
          this.tabGameBai.setSiblingIndex(0);
          this.tabGameQuay.setSiblingIndex(1);
          this.contentScroll.content.position = new cc.Vec3(0,0,0);
          this.contentScroll.scrollToPercentHorizontal(0, .8);
          break;
        case "slots":
          this.btnSlots.interactable = false;

          this.tabAll.setSiblingIndex(4);
          this.tabSlots.setSiblingIndex(0);
          this.tabNull.setSiblingIndex(1);
          this.tabGameBai.setSiblingIndex(2);
          this.tabGameQuay.setSiblingIndex(3);
          this.contentScroll.content.position = new cc.Vec3(0,0,0);
          this.contentScroll.scrollToPercentHorizontal(0, .8);

          break;
        case "mini":
          this.btnMini.interactable = false;
          
          this.tabAll.setSiblingIndex(1);
          this.tabSlots.setSiblingIndex(2);
          this.tabNull.setSiblingIndex(3);
          this.tabGameBai.setSiblingIndex(4);
          this.tabGameQuay.setSiblingIndex(0);
          this.contentScroll.content.position = new cc.Vec3(0,0,0);
          this.contentScroll.scrollToPercentHorizontal(0, .8);
          break;
      }


      // var self = this;
      // setTimeout(function () {
      //     self.nodeLayoutEvent.x = (-self.nodeContent.width) + 35;
      //     self.nodeLayoutJackpot.x = (-self.nodeContent.width);
      // }, 15);
    },
  });
}.call(this));
