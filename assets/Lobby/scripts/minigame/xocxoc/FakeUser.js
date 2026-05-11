// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
function taoTenNguoiDungKhongDau() {
  const tinhTu = [
    "Nhanh",
    "LangLe",
    "VuiVe",
    "ManhMe",
    "ThongMinh",
    "BiAn",
    "TinhTao",
    "DenToi",
  ];
  const danhTu = [
    "Ho",
    "Rong",
    "Tho",
    "Soi",
    "Gau",
    "Cao",
    "PhuThuy",
    "ChienBinh",
  ];
  const so = Math.floor(Math.random() * 1000);

  const tu1 = tinhTu[Math.floor(Math.random() * tinhTu.length)];
  const tu2 = danhTu[Math.floor(Math.random() * danhTu.length)];

  return `${tu1}${tu2}${so}`.toLowerCase();
}

cc.Class({
  extends: cc.Component,

  properties: {
    // foo: {
    //     // ATTRIBUTES:
    //     default: null,        // The default value will be used only when the component attaching
    //                           // to a node for the first time
    //     type: cc.SpriteFrame, // optional, default is typeof default
    //     serializable: true,   // optional, default is true
    // },
    // bar: {
    //     get () {
    //         return this._bar;
    //     },
    //     set (value) {
    //         this._bar = value;
    //     }
    // },
    listAvatar: [cc.SpriteFrame],
    money: cc.Label,
    avatar: cc.Sprite,
    nameUser: cc.Label,
  },

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {},

  start() {
    this.money.string = cc.Tool.getInstance().formatMoney(
      Math.floor(Math.random() * (350000000 - 50000000 + 1) + 100000000)
    );
    this.avatar.spriteFrame =
      this.listAvatar[Math.floor(Math.random() * this.listAvatar.length)];
    this.nameUser.string = cc.Config.getInstance().formatName(
      taoTenNguoiDungKhongDau(),
      7
    );
  },

  // update (dt) {},
});
