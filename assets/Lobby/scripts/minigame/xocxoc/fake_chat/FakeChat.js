// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

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
    textChat: cc.Label,
    nodeChat: cc.Node,
  },

  onLoad() {
    this.messages = [
      "lẻ đi xin m đấy",
      "dkm nhà m cái game bịp",
      "xin 1m đi ăn tối đi cái",
      "soi ít thôi cái đmm chúng m",
      "lẻ",
      "lẻ đi xin m",
      "chẵn đi mà",
      "bán cmn nhà r",
      "tiền ơi",
      "xin 1 tay thôi",
      "5 tay thông r đấy cái à",
      "lẻ bú ae",
      "không lẻ chặt cu",
      "á đù",
      "chẵn bú ae êiii",
      "biết ngay mà",
      "thôi ăn lol rồi",
      "mẹ nó chứ",
      "lẻ đi đừng ra chẵn",
      "Bố chịu",
      "234 X 9",
      "bác nào cho e xin 3 tay",
      "dcm may",
      "tao nói lẻ bú",
      "Đcm all in",
      "buon",
      "3m chẵn",
      "bẻ đc chưa ae",
      "tôi bắc ninh đây b ơi",
      "chẵn 14",
      "đánh 1 bên thôi ae",
      "chuẩn bị vào cầu bệt",
      "Ae chẵn khỏe",
      "chẵn còn cái nịt hahha",
      "giờ về x nữa",
      "vui thật",
      "Theo lẻ gõ số 5 coi",
      "cầu đi 1212",
      "cá hồi",
      "ngu rồi",
      "mất hết rồi",
      "triệu hồi 7",
      "theo t 1m hehe",
      "Nghi chẵn lắm",
      "biết mà",
      "Chờ tí ra kép",
      "Kq X8 ae",
      "lẻ 8",
      "theo chẵn vậy",
      "Nhẹ tiền thì ăn",
      "lẻ cmm",
      "hup manh",
      "theo nhẹ lẻ",
      "Ae húp X10",
      "bú đi",
      "chẵn húp nào",
      "uiz dời ơiii",
      "nặn chẵn nào",
      "trả tiền cc ak",
      "all in lẻ ae",
      "Có nên đánh kép ko nhỉ",
      "all lẻ quay đầu",
      "chơi tí rồi nghỉ",
      "hũ to vl ăn được thì ấm",
      "Chẵn!",
      "Lẻ!",
      "Chẵn phát ăn luôn!",
      "Lẻ cái là win!",
      "Quá đỏ chẵn!",
      "Lẻ chắc rồi!",
      "Chẵn đi anh em!",
      "Lẻ không về nghỉ chơi!",
      "Chẵnnnnnnnn",
      "Lẻeeeee",
      "Chẵn cmm đi",
      "Lẻ nữa đi!",
      "Chẵn đi xin đấy",
      "Lẻ 100%!",
      "thooi an loz r",
      "Lẻ them 1 phat nua di",
      "nổ nổ nổ ",
      "Lẻ điiiiii",
      "Chẵn win",
      "Lẻ mãi đỉnh!",
      "Chẵn phát là win!",
      "Lẻ như ý!",
      "Chẵn thôi!",
      "Lẻ bách phát bách trúng!",
      "Chẵn chắc kèo!",
      "Lẻ kèo thơm!",
      "Chẵn một phát ăn ngay!",
      "Lẻ là chân ái!",
      "Chẵn ổn áp nhỉ!",
      "Lẻ là có tiền!",
      "Chẵn đang đỏ lắm!",
      "Lẻ lụm tiền!",
      "Chẵn không trượt phát nào!",
      "Lẻ tới số cmnr!",
      "Chẵn cho em!",
      "Lẻ 2 phát nữa dẫn ae đi chơi gái!",
      "Chẵn húp",
      "Lẻ nè",
      "Chẵn xịn xò!",
      "Lẻ lên!",
      "Chẵn đi nhẹ về tiền!",
      "Lẻ chốt đơn!",
      "Chẵn chưa bao giờ sai!",
      "Lẻ rồi nha!",
      "Chẵn ăn chắc!",
      "Lẻ lên aee!",
      "Chó là b kp tôi!",
      "Lẻ là húp thôi!",
      "Chẵn lướt nhẹ!",
      "Lẻ đặt lẹ!",
      "Thôi rồi lẻ ơi",
      "Bệt cmnr",
      "Dcm",
      "Cai dm",
      "Bố thua 100m rồi còn soi cmm",
      "Bịp thế la cùng",
      "dmm",
      "không lẻ chặt cu",
      "lồn mẹ mày ad",
      "vl con game",
      "con thở là còn gỡ",
      "vl luôn",
      "vãi loz",
      "tao xin m",
      "game bịp vcl",
      "bịp rõ thế",
      "dmm bịp ít thôi",
      "chán nổ đi sang rồi còn đi làm nữa",
      "xin 1 lần nổ hũ",
      "kho' danh' vkl",
      "con ba no nua chu",
      "all xỉu",
      "all tài di",
      "xỉu chắc r",
      "tài chắc",
      "hà nội đâu chơi gái ok ae nhỉ",
      "vừa bú 200m",
      "xin tứ ván này nổ đi",
      "dmmmm",
      "t mệt lắm rồi",
      "chó đẻ",
      "nổ",
      "chịu rồi",
      "dcm thông 5 tay rồi đấy",
      "soi clm chúng m à",
      "xin tứ",
      "kbh ăn đc cno đâu",
      "nốt ván bỏ game",
      "tứ đi",
      "đcm gãy 10 tay",
      "thua",
      "hãm lồn soi tao",
      "về cầu 1-1 đi mà",
      "đi ngang đi bịp",
      "đời t sao dính vào trò này kbiet",
      "khổ lắm rồi",
      "má mày",
      "dcm m sun ad",
      "hũ nổ cmm đi",
      "địt cụ cho xin 1 tay đi",
      "vkl đéo nổ",
      "nghỉ mẹ đi",
      "bắt đầu gieest r",
      "dm soi cc",
      "bố biết ngay",
      "dkmmmm",
      "dmm nhà",
      "toàn chẵn với sai vị. vkl",
      "1-1",
      "dcmmm khổ lắm r đấy",
      "bán nhà cmnr",
      "clgt",
      "vãi lồncc",
      "cc toàn chẵn",
      "nổ mẹ đi cho ae t đi ngủ",
      "chơi toàn bị soi",
      "game giờ bịp vkl nhỉ",
      "đúng con game rác",
      "nhảy vcl",
      "khó chơi đéo chịu đc",
      "thua 7  tay thông. soi bố nữa đi mấy con chó",
      "ko đánh nổi cno đâu",
      "bao nhiêu cũng hết",
      "sin",
      "123-123",
      "t là bình gold đây",
      "mãi đéo nổ",
      "nó nhử đấy. chưa 1 lần đc nổ hũ",
      "tối đến giờ tứ linh hốc của t 240m rồi đấy",
      "chưa biết hình dạng cái hũ ntn",
      "bip",
      "chịu",
      "cứ đặt là ra ngc lại",
      "bố tổ chúng m cái bọn bịp",
      "100% soi",
      "vkl. rẻ rách thật",
      "xóa game",
      "Bú 100 triệu rồi!",
      "Chó là b kp tôi!",
      "Lẻ là húp thôi!",
      "Chẵn lướt nhẹ!",
      "Lẻ đặt lẹ!",
    ];

    this.nodeChat.opacity = 0;
    this.nodeChat.active = false;

    this.scheduleNextMessage();
  },

  scheduleNextMessage() {
    let delay = 3 + Math.random() * 3; // Random từ 5 đến 10s
    this.scheduleOnce(() => {
      let message = this.getRandomMessage();
      this.showMessage(message);
    }, delay);
  },

  getRandomMessage() {
    let index = Math.floor(Math.random() * this.messages.length);
    return this.messages[index];
  },

  showMessage(message) {
    this.textChat.string = message;
    this.nodeChat.active = true;
    this.nodeChat.opacity = 0;

    cc.tween(this.nodeChat)
      .to(0.3, { opacity: 255 }) // Fade in
      .delay(2) // Giữ 0.7s
      .to(0.3, { opacity: 0 }) // Fade out
      .call(() => {
        this.nodeChat.active = false;
        this.scheduleNextMessage();
      })
      .start();
  },
});
