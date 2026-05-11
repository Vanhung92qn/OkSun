(function () {
  const GATE_TEXT = {
    4: "Chẵn",
    1: "Lẻ",
    2: "3 Đỏ",
    5: "4 Đỏ",
    3: "3 Trắng",
    6: "4 Trắng",
  };
  const RESULT_TEXT = {
    4: "Chẵn",
    1: "Lẻ",
    2: "3 Đỏ", // hoặc '3 Đỏ'
    5: "4 Đỏ", // hoặc '4 Đỏ'
    3: "3 Trắng",
    6: "4 Trắng",
  };
  cc.XXHistoryItem2 = cc.Class({
    extends: cc.Component,
    properties: {
      lblTime: cc.Label,
      lbSession: cc.Label,
      nodeBetLines: cc.Node, // layoutbetside
      lblResult: cc.Label,
      iconResult: cc.Sprite,
      lbAmountWin: cc.Label,
      sfIcon: [cc.SpriteFrame],

      // tuỳ chỉnh cell nếu cần
      cellWidth: { default: 210 }, // chiều rộng mỗi “ô” cửa đặt
      cellHeight: { default: 26 }, // chiều cao mỗi “ô” cửa đặt
      spacingX: { default: 10 },
      spacingY: { default: 6 },
    },

    _toResultText(gatesData, fallbackGate) {
      // gatesData như "1,3" | "4" | "4,6" ...
      // let ids = [];
      // if (gatesData && typeof gatesData === 'string') {
      //     ids = gatesData.split(',')
      //         .map(s => parseInt(s.trim(), 10))
      //         .filter(Number.isFinite);
      // }
      // // nếu rỗng thì fallback theo ResultGate
      // if (!ids.length && Number.isFinite(fallbackGate)) ids = [fallbackGate];

      // // sắp thứ tự: ưu tiên 1/2 trước, rồi 3/4/5/6 sau
      // const order = [1, 2, 3, 4, 5, 6];
      // ids = Array.from(new Set(ids)).sort((a, b) => order.indexOf(a) - order.indexOf(b));

      // map sang text
      // const parts = ids.map(id => RESULT_TEXT[id]).filter(Boolean);
      // return parts.join(' / ');
      if (fallbackGate) {
        let rs1 = "";

        if (fallbackGate < 4) {
          rs1 = "Lẻ";
        } else {
          rs1 = "Chẵn";
        }
        let rs2 = RESULT_TEXT[fallbackGate];
        if (rs1 == rs2) {
          return rs1;
        } else {
          return `${rs1}/${rs2}`;
        }
      } else {
        return "";
      }
    },

    updateItem(itemData) {
      // cc.log("itemData", itemData);
      const input = itemData.CreateTimeFm;
      const [date, time] = input.split(" ");
      const result = `${time} ${date}`;
      this.lblTime.string = result || "";
      this.lbSession.string = "#" + (itemData.SessionID || "");

      this._renderBets(itemData.Bets);

      this.lblResult.string = this._toResultText(
        itemData.GatesData,
        itemData.ResultGate
      );
      // console.log('itemData   ===> ' + JSON.stringify(itemData));
      // --- TIỀN THẮNG/THUA RÒNG ---
      const net = Number(itemData.AmountWin || 0);
      console.log("net ===> " + net);
      if (net >= 0) {
        this.lbAmountWin.string = cc.Tool.getInstance().formatNumber(net);
      } else {
        // nó đang là số âm, nên hiển thị dấu trừ
        // đưa về dạng số dương để hiển thị
        console.log("net < 0 ===> " + cc.Tool.getInstance().formatNumber(-net));
        this.lbAmountWin.string = `- ${cc.Tool.getInstance().formatNumber(
          -net
        )}`;
      }
    },

    _renderBets(bets) {
      if (!this.nodeBetLines) return 0;

      this.nodeBetLines.removeAllChildren();
      if (!bets || !bets.length) return 0;

      // cộng dồn theo cửa + tính tổng cược
      const sumByGate = {};
      let totalBet = 0;
      for (const b of bets) {
        const g = b.gate ?? b.GateID;
        const val = b.bet ?? b.Bet ?? 0;
        if (!sumByGate[g]) sumByGate[g] = 0;
        sumByGate[g] += val;
        totalBet += val;
      }

      // setup Layout GRID
      let layout = this.nodeBetLines.getComponent(cc.Layout);
      if (!layout) layout = this.nodeBetLines.addComponent(cc.Layout);
      layout.type = cc.Layout.Type.GRID;
      layout.resizeMode = cc.Layout.ResizeMode.CONTAINER;
      layout.startAxis = cc.Layout.AxisDirection.HORIZONTAL;
      layout.spacingX = this.spacingX;
      layout.spacingY = this.spacingY;
      layout.verticalDirection = cc.Layout.VerticalDirection.TOP_TO_BOTTOM;
      layout.horizontalDirection = cc.Layout.HorizontalDirection.LEFT_TO_RIGHT;

      // tạo cell label cho mỗi cửa
      const gateIds = Object.keys(sumByGate).map((n) => parseInt(n, 10));
      gateIds.forEach((gate) => {
        const cell = new cc.Node();
        // kích thước ô để GRID sắp xếp đúng
        cell.setContentSize(this.cellWidth, this.cellHeight);

        const label = cell.addComponent(cc.Label);
        label.string = `${GATE_TEXT[gate] || "Cửa " + gate} : ${this._fmtShort(
          sumByGate[gate]
        )}`;
        label.fontSize = 20;
        label.lineHeight = this.cellHeight;
        label.overflow = cc.Label.Overflow.SHRINK; // tự co nếu dài
        label.horizontalAlign = cc.Label.HorizontalAlign.LEFT;
        label.verticalAlign = cc.Label.VerticalAlign.CENTER;

        this.nodeBetLines.addChild(cell);
      });

      layout.updateLayout();
      return totalBet;
    },

    _fmtShort(n) {
      if (n >= 1e9) return Math.round(n / 1e8) / 10 + "B";
      if (n >= 1e6) return Math.round(n / 1e5) / 10 + "M";
      if (n >= 1e3) return Math.round(n / 1e3) + "K";
      return cc.Tool.getInstance().formatNumber(n);
    },

    _pickIcon(g) {
      switch (g) {
        case 1:
          return this.sfIcon[1];
        case 2:
          return this.sfIcon[2];
        case 3:
          return this.sfIcon[3];
        case 4:
          return this.sfIcon[0];
        case 5:
          return this.sfIcon[5];
        case 6:
          return this.sfIcon[4];
        default:
          return null;
      }
    },
  });
}).call(this);
