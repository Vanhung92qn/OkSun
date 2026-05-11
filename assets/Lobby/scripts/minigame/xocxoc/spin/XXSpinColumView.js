/**
 * Created by Nofear on 3/22/2019.
 */

(function () {
  cc.XXSpinColumView = cc.Class({
    extends: cc.Component,
    properties: {
      spriteIcons: [cc.Sprite],
      spriteBlurIcons: [cc.SpriteFrame],
      maskNode: cc.Node,
    },

    onLoad: function () {
      if (this.maskNode) {
        this.maskNode.active = false;
      }
      this.scheduler = cc.director.getScheduler();
      this.animCol = this.getComponent(cc.Animation);
      // console.log("XXSpinColumView onLoad");
      // console.log(this.animCol);
    },

    start: function () {
      this.colId = parseInt(this.node.name) - 1;
      this.icons = cc.XXSpinController.getInstance().getSFDices();
      this.blurIcons = this.spriteBlurIcons;
      // this.randomAllIcon();
      // this.spin(1);
      // setTimeout(() => {
      //     this.stop();
      // }, 4000);
    },

    randomAllIcon: function () {
      if (!this.spriteIcons || !this.blurIcons || this.blurIcons.length === 0) return;
      var n = Math.min(2, this.spriteIcons.length);
      for (var i = 0; i < n; i++) {
        var s = this.spriteIcons[i];
        if (!s) continue;
        var ran = Math.floor(Math.random() * this.blurIcons.length);
        var bf = this.blurIcons[ran];
        if (bf) s.spriteFrame = bf;
      }
    },

    //tam thoi bo? -> ham goi tu animation
    randomIcon: function (indexIcon) {
      // var ran = Math.floor((Math.random() * 52));
      // this.spriteIcons[parseInt(indexIcon.toString())].spriteFrame = this.icons[ran];
    },

    randomIcon2: function (indexIcon) {
      // var ran = Math.floor((Math.random() * 6));
      // this.spriteIcons[parseInt(indexIcon.toString())].spriteFrame = this.blurIcons[ran];
      // console.log("randomIcon2", indexIcon, ran);
    },

    //set du lieu tu server
    setData: function () {
      if (this.maskNode) {
        this.maskNode.active = false;
      }
      if (!this.spriteIcons || !this.icons || this.icons.length === 0) return;
      for (var i = 0; i < this.spriteIcons.length; i++) {
        var s = this.spriteIcons[i];
        if (!s) continue;
        var ran = Math.floor(Math.random() * this.icons.length);
        var f = this.icons[ran];
        if (f) s.spriteFrame = f;
      }
    },

    finishSpin: function () {
      cc.XXSpinController.getInstance().stopSpinFinish();
       if (this.maskNode) {
        this.maskNode.active = false;
      }
    },

    spin: function (lineId) {
      this.lineId = lineId;
      this.unscheduleAllCallbacks();

      // Tạo hiệu ứng random mượt
      this.schedule(() => {
        this.randomAllIcon();
      }, 0.1);

      if (this.animCol) this.animCol.play("columnSpin");
      if (this.maskNode) this.maskNode.active = true;
    },

    stop: function () {
      this.isFastSpin = false;
      this.unscheduleAllCallbacks();
      if (this.animCol) this.animCol.play("columnStop");
      const colId = this.colId;
      const ketQua = cc.XXSpinController.getInstance().getKetQua();
      if (!ketQua || !this.icons || !this.spriteIcons) return;
      const diceValue = ketQua[colId] != null ? ketQua[colId] : 1;
      const iconFrame = this.icons.find((sf) =>
        sf && sf.name && sf.name.includes(diceValue.toString())
      );
      if (!iconFrame) {
        console.warn("Không tìm thấy spriteFrame cho dice:", diceValue);
        return;
      }
      var icon = this.spriteIcons[0];
      if (icon) icon.spriteFrame = iconFrame;
      var icon2 = this.spriteIcons[1];
      if (icon2) icon2.spriteFrame = iconFrame;
      if (this.maskNode) this.maskNode.active = false;
    },

    fastStop: function () {
      this.isFastSpin = true;
      this.setData();
      if (this.animCol) this.animCol.play("columnStop2");
    },
  });
}).call(this);
