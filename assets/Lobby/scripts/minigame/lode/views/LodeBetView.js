// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
  extends: cc.Component,

  properties: {
    nodeBetArea: [cc.Node],
    nodeBetSideTabs: [cc.Node],
    nodeBetSideTabsMienTrung: [cc.Node],
    nodeBetSideTabsMienNam: [cc.Node],

    // all node label guide bet lo de
    nodeGuidesArea: [cc.Node],
    nodeGuides: [cc.Node],
    nodeGuidesMienTrung: [cc.Node],
    nodeGuidesMienNam: [cc.Node],

    // all node bet type lo de mièn bắc
    nodeBetTypes: [cc.Node],
    // all node bet type lo de mièn trung
    nodeBetTypesMienTrung: [cc.Node],
    // all node bet type lo de mièn trung
    nodeBetTypesMienNam: [cc.Node],

    //miền bắc
    // all node child bet bao lo
    nodeBetBaoLo: [cc.Node],

    // all node child bet danh de
    nodeBetDanhDe: [cc.Node],

    // all node child bet ba cang
    nodeBetBaCang: [cc.Node],

    // all node child bet dau duoi
    nodeBetDauDuoi: [cc.Node],

    // all node child bet lo xien
    nodeBetLoXien: [cc.Node],

    //miền trung
    // all node child bet bao lo
    nodeBetBaoLoMienTrung: [cc.Node],

    // all node child bet danh de
    nodeBetDanhDeMienTrung: [cc.Node],

    // all node child bet ba cang
    nodeBetBaCangMienTrung: [cc.Node],

    // all node child bet dau duoi
    nodeBetDauDuoiMienTrung: [cc.Node],

    // all node child bet lo xien
    nodeBetLoXienMienTrung: [cc.Node],

    //miền nam
    // all node child bet bao lo
    nodeBetBaoLoMienNam: [cc.Node],

    // all node child bet danh de
    nodeBetDanhDeMienNam: [cc.Node],

    // all node child bet ba cang
    nodeBetXiuChuMienNam: [cc.Node],

    // all node child bet dau duoi
    nodeBetDauDuoiMienNam: [cc.Node],

    // all node child bet lo xien
    nodeBetLoDaMienNam: [cc.Node],

    lbTienThang: cc.Label,
    editTongCuoc: cc.EditBox,
    editTienCuoc1Con: cc.EditBox,
    editTicketAmount: cc.EditBox,
    nodeGuide: cc.Node,
    lbNote:cc.RichText,
    toggleChooseValue: cc.ToggleChooseValue,
    animationMenuCity: cc.Animation,
    cityName: cc.Label
  },

  onLoad() {
    cc.LodeController.getInstance().setLodeBetView(this);
    this.animationMenuCity.node.scaleY = 0;
    this.city = 1;
    this.Area = 1;
    this.currentDateResult = new Date();
    this.isOpenChooseCity = false;
    this.animOpenName = 'showDropdownMenu';
    this.animCloseName = 'hideDropdownMenu';
    this.aniTicket = this.editTicketAmount.getComponent(cc.Animation);
    this.aniGuide = this.nodeGuide.getComponent(cc.Animation);
    this.btnTabDeactive = [];
    this.btnTabActive = [];
    this.nodeGuideLoDeIndex = -1;
    this.nodeBetTypeLoDeIndex = -1;
    this.nodeChildBetTypeLoDeIndex = -1;
    
    //miền bắc
    this.arrPayBetTypeBaoLo = [27, 23];
    this.arrWinBetTypeBaoLo = [99, 900];

    this.arrPayBetTypeDanhDe = [4,1];
    this.arrWinBetTypeDanhDe = [95,95];

    this.arrPayBetType3Cang = [1];
    this.arrWinBetType3Cang = [900];

    this.arrPayBetTypeDauDuoi = [1, 1];
    this.arrWinBetTypeDauDuoi = [9.5, 9.5];

    this.arrPayBetTypeLoXien = [1, 1, 1];
    this.arrWinBetTypeLoXien = [17, 65, 250];

    //miền trung
    this.arrPayBetTypeBaoLoMienTrung = [18, 17];
    this.arrWinBetTypeBaoLoMienTrung = [98, 900];

    this.arrPayBetTypeDanhDeMienTrung = [1,1];
    this.arrWinBetTypeDanhDeMienTrung = [95,95];

    this.arrPayBetType3CangMienTrung = [1,1,2];
    this.arrWinBetType3CangMienTrung = [900,900,900];

    this.arrPayBetTypeDauDuoiMienTrung = [1, 1];
    this.arrWinBetTypeDauDuoiMienTrung = [9.5, 9.5];

    this.arrPayBetTypeLoXienMienTrung = [1, 1, 1];
    this.arrWinBetTypeLoXienMienTrung = [34, 185, 970];

    //miền nam
    this.arrPayBetTypeBaoLoMienNam = [18, 17];
    this.arrWinBetTypeBaoLoMienNam = [98, 900];

    this.arrPayBetTypeDanhDeMienNam = [1,1,2];
    this.arrWinBetTypeDanhDeMienNam = [95,95,95];

    this.arrPayBetTypeXiuChuMienNam = [1,1,2];
    this.arrWinBetTypeXiuChuMienNam = [900,900,900];

    this.arrPayBetTypeDauDuoiMienNam = [1, 1];
    this.arrWinBetTypeDauDuoiMienNam = [9.5, 9.5];

    this.arrPayBetTypeLoDaMienNam = [1, 1, 1];
    this.arrWinBetTypeLoDaMienNam = [34, 185, 970];
    this.activeBetArea(1);
    
    this.getListCityByDay();
  },
  resetScale: function () {
    this.animationMenuCity.node.scaleY = 0;
    this.animationMenuCity.node.opacity = 255;
},

restoreScale: function () {
    this.animationMenuCity.node.scaleY = 1;
    this.animationMenuCity.node.opacity = 0;
},
  getListCityByDay: function () {
    var getListCityByDayCommand = new cc.GetListCityByDayCommand;
    let openDate = `${
      this.currentDateResult.getMonth() + 1
    }-${this.currentDateResult.getDate()}-${this.currentDateResult.getFullYear()}`;
    getListCityByDayCommand.execute(this,openDate);
  },
  onGetListCityByDayResponse: function (response) {
    // cc.BankController.getInstance().setResponseTopupBanks(response);
    // if (response.Type) {
    //     this.type = response.Type;
    // }
    this.toggleChooseValue.resetListChooseValue();
    //var list = ['Miền Bắc','Cà Mau','TP.HCM','Vũng Tàu','Đà Nẵng','Huế'];
    var list =response;
    var self = this;
    var posY = -35;// Vi tri dau tien cua Item -> fix bug
    var index = 0;
    list.forEach(function (city) {
       
        self.toggleChooseValue.initializeToggleChooseValue(
            self,
            "LodeBetView",
            "selectCityEvent",
            city,
            city.CityName,
            posY
        );
        //if (index === 0) {
        //    self.setLBSelectedBank(bank);
        //}
        //index++;
        //Moi phan tu cac nhau 50 (do ko dung layout de fix bug)
        posY -= 50;
    })
  },
  selectCityEvent: function(event, data) {
    
    this.cityName.string = data.CityName;
    this.city = data.CityID;
    this.Area = data.Area;
    this.hideChooseCity();
    this.activeBetArea(this.Area);
    
  },
  updateNumberChoose: function (choose) {
    this.editTicketAmount.string = choose;
  },
  updateTongCuoc: function (number) {
    this.editTongCuoc.string = Number(this.editTongCuoc.string) * number;
  },

  confirmBet: function () {
    if (this.editTicketAmount.string.length < 1) {
      cc.PopupController.getInstance().showMessage(
        "Bạn phải chọn ít nhất 1 số"
      );
      return;
    }

    if (this.userBet < 1000) {
      cc.PopupController.getInstance().showMessage("Tổng cược ít nhất là 5k");
      return;
    }

    if (Number(this.editTienCuoc1Con.string) < 1) {
      cc.PopupController.getInstance().showMessage(
        "Tiền cược 1 con ít nhất là 1k"
      );
      return;
    }

    let numberChooses = cc.LodeController.getInstance().getNumberChooses();

    if (!numberChooses || numberChooses.length < 1) {
      cc.PopupController.getInstance().showMessage(
        "Bạn phải chọn ít nhất 1 số để cược"
      );
      return;
    }

    let choosed = "";
    for (let i = 0; i < numberChooses.length; i++) {
      let value = numberChooses[i];
      let type = this.typeBet;
      if (type == cc.LodeType.BaCang || type == cc.LodeType.Lo3So || type == cc.LodeType.Lo3SoMienTrung || type == cc.LodeType.Lo3SoMienNam
        || type == cc.LodeType.BaCangDauMienTrung || type == cc.LodeType.BaCangDuoiMienTrung || type == cc.LodeType.BaCangDauDuoiMienTrung
        || type == cc.LodeType.XiuChuDauMienNam || type == cc.LodeType.XiuChuDuoiMienNam || type == cc.LodeType.XiuChuDauDuoiMienNam) {
          choosed +=  (value < 10) ? "00" + value + ",": ((value < 100) ? "0" + value + "," : value + ",");
    }
      else if (
        value < 10 &&
        this.typeBet !== cc.LodeType.Dau && this.typeBet !== cc.LodeType.Duoi
        && this.typeBet !== cc.LodeType.DauMienTrung && this.typeBet !== cc.LodeType.DuoiMienTrung
        && this.typeBet !== cc.LodeType.DauMienNam && this.typeBet !== cc.LodeType.DuoiMienNam
        
      ) {
        choosed += "0" + value + ",";
      } else {
        choosed += value + ",";
      }
    }
    //console.log(choosed);
    choosed = choosed.substring(0, choosed.length - 1);
    let openDate = `${
      this.currentDateResult.getMonth() + 1
    }-${this.currentDateResult.getDate()}-${this.currentDateResult.getFullYear()}`;
    cc.LodeController.getInstance().sendRequestOnHub(
      cc.MethodHubName.BET,
      this.typeBet,
      this.userBet,
      choosed,
      this.city,
      openDate
    );
  },

  onTabClicked: function (event, index) {
    this.aniTicket.play("showEditTicket");
    this.nodeGuideLoDeIndex = index;
    this.editTienCuoc1Con.string = "1";

    for (var i = 0; i < this.btnTabActive.length; i++) {
      let actived = i == index;
      this.btnTabActive[i].active = actived;
      this.nodeBetTypes[i].active = actived;

      if (actived) {
        let number = Number(index);
        this.nodeBetTypeLoDeIndex = number;
        this.updateNumberChoose("");
        switch (number) {
          // bao lo
          case 0:
            
              this.editTongCuoc.string = this.arrPayBetTypeBaoLo[0];
              this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
                this.arrWinBetTypeBaoLo[0] * 1000
              );

            this.typeBet = cc.LodeType.Lo2So;
            this.openChildBetBaoLo(null, 0);
            break;

          // danh de
          case 1:
              this.editTongCuoc.string = this.arrPayBetTypeDanhDe[0];
              this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
                this.arrWinBetTypeDanhDe[0] * 1000
              );
            //this.typeBet = cc.LodeType.Lo2So;
            this.openChildBetDanhDe(null, 0);
            break;

          // ba cang
          case 2:
            this.editTongCuoc.string = this.arrPayBetType3Cang[0];
            this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
              this.arrWinBetType3Cang[0] * 1000
            );

            this.openChildBetBaCang(null, 0);
            break;

          // dau duoi
          case 3:
            this.editTongCuoc.string = this.arrPayBetTypeDauDuoi[0];
              this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
                this.arrWinBetTypeDauDuoi[0] * 1000
              );

            this.openChildBetDauDuoi(null, 0);
            break;

          // lo xien
          case 4:
            this.editTongCuoc.string = this.arrPayBetTypeLoXien[0];
              this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
                this.arrWinBetTypeLoXien[0] * 1000
              );

            this.openChildBetLoXien(null, 0);
            break;
        }
      }
    }
  },
  onTabClickedMienTrung: function (event, index) {
    this.aniTicket.play("showEditTicket");
    this.nodeGuideLoDeIndex = index;
    this.editTienCuoc1Con.string = "1";

    for (var i = 0; i < this.btnTabActive.length; i++) {
      let actived = i == index;
      this.btnTabActive[i].active = actived;
      this.nodeBetTypesMienTrung[i].active = actived;

      if (actived) {
        let number = Number(index);
        this.nodeBetTypeLoDeIndex = number;
        this.updateNumberChoose("");
        switch (number) {
          // bao lo
          case 0:
            
              this.editTongCuoc.string = this.arrPayBetTypeBaoLoMienTrung[0];
              this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
                this.arrWinBetTypeBaoLoMienTrung[0] * 1000
              );

            this.typeBet = cc.LodeType.Lo2SoMienTrung;
            this.openChildBetBaoLo(null, 0);
            break;

          // danh de
          case 1:
              this.editTongCuoc.string = this.arrPayBetTypeDanhDeMienTrung[0];
              this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
                this.arrWinBetTypeDanhDeMienTrung[0] * 1000
              );
            //this.typeBet = cc.LodeType.Lo2So;
            this.openChildBetDanhDe(null, 0);
            break;

          // ba cang
          case 2:
            this.editTongCuoc.string = this.arrPayBetType3CangMienTrung[0];
            this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
              this.arrWinBetType3CangMienTrung[0] * 1000
            );

            this.openChildBetBaCang(null, 0);
            break;

          // dau duoi
          case 3:
            this.editTongCuoc.string = this.arrPayBetTypeDauDuoiMienTrung[0];
              this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
                this.arrWinBetTypeDauDuoiMienTrung[0] * 1000
              );

            this.openChildBetDauDuoi(null, 0);
            break;

          // lo xien
          case 4:
            this.editTongCuoc.string = this.arrPayBetTypeLoXienMienTrung[0];
              this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
                this.arrWinBetTypeLoXienMienTrung[0] * 1000
              );

            this.openChildBetLoXien(null, 0);
            break;
        }
      }
    }
  },
  onTabClickedMienNam: function (event, index) {
    this.aniTicket.play("showEditTicket");
    this.nodeGuideLoDeIndex = index;
    this.editTienCuoc1Con.string = "1";

    for (var i = 0; i < this.btnTabActive.length; i++) {
      let actived = i == index;
      this.btnTabActive[i].active = actived;
      this.nodeBetTypesMienNam[i].active = actived;

      if (actived) {
        let number = Number(index);
        this.nodeBetTypeLoDeIndex = number;
        this.updateNumberChoose("");
        switch (number) {
          // bao lo
          case 0:
            
              this.editTongCuoc.string = this.arrPayBetTypeBaoLoMienNam[0];
              this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
                this.arrWinBetTypeBaoLoMienNam[0] * 1000
              );

            this.typeBet = cc.LodeType.Lo2SoMienNam;
            this.openChildBetBaoLo(null, 0);
            break;

          // danh de
          case 1:
              this.editTongCuoc.string = this.arrPayBetTypeDanhDeMienNam[0];
              this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
                this.arrWinBetTypeDanhDeMienNam[0] * 1000
              );
            //this.typeBet = cc.LodeType.Lo2So;
            this.openChildBetDanhDe(null, 0);
            break;

          // ba cang
          case 4:
            this.editTongCuoc.string = this.arrPayBetTypeXiuChuMienNam[0];
            this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
              this.arrWinBetTypeXiuChuMienNam[0] * 1000
            );

            this.openChildBetBaCang(null, 0);
            break;

          // dau duoi
          case 3:
            this.editTongCuoc.string = this.arrPayBetTypeDauDuoiMienNam[0];
              this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
                this.arrWinBetTypeDauDuoiMienNam[0] * 1000
              );

            this.openChildBetDauDuoi(null, 0);
            break;

          // lo xien
          case 2:
            this.editTongCuoc.string = this.arrPayBetTypeLoDaMienNam[0];
              this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
                this.arrWinBetTypeLoDaMienNam[0] * 1000
              );

            this.openChildBetLoXien(null, 0);
            break;
        }
      }
    }
  },

  openPopupChooseView: function (event, data) {
    if (this.Area == 1) {
      switch (this.nodeBetTypeLoDeIndex) {
        // bao lo
        case 0:
          switch (this.nodeChildBetTypeLoDeIndex) {
            // lo 2 so
            case 0:
              if (this.editTongCuoc.string.length < 1) {
                this.editTongCuoc.string = this.arrPayBetTypeBaoLo[0];
                this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
                  this.arrWinBetTypeBaoLo[0] * 1000
                );
              }
  
              this.typeBet = cc.LodeType.Lo2So;
              cc.LodeController.getInstance()
                .getLodeView()
                .onOpenChooseView(null, cc.LodeType.Lo2So);
              break;
  
            // lo 3 so
            case 1:
              if (this.editTongCuoc.string.length < 1) {
                this.editTongCuoc.string = this.arrPayBetTypeBaoLo[1];
                this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
                  this.arrWinBetTypeBaoLo[1] * 1000
                );
              }
  
              this.typeBet = cc.LodeType.Lo3So;
              cc.LodeController.getInstance()
                .getLodeView()
                .onOpenChooseView(null, cc.LodeType.Lo3So);
              break;
          }
  
          break;
  
        // danh de
        case 1:
          
          switch (this.nodeChildBetTypeLoDeIndex) {
            // de dau
            case 0:
              if (this.editTongCuoc.string.length < 1) {
                this.editTongCuoc.string = this.arrPayBetTypeDanhDe[0];
                this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
                  this.arrWinBetTypeDanhDe[0] * 1000
                );
              }
      
              this.typeBet = cc.LodeType.DeDau;
              cc.LodeController.getInstance()
                .getLodeView()
                .onOpenChooseView(null, cc.LodeType.DeDau);
              break;
  
            // de dac biet
            case 1:
              if (this.editTongCuoc.string.length < 1) {
                this.editTongCuoc.string = this.arrPayBetTypeDanhDe[1];
                this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
                  this.arrWinBetTypeDanhDe[1] * 1000
                );
              }
      
              this.typeBet = cc.LodeType.DanhDe;
              cc.LodeController.getInstance()
                .getLodeView()
                .onOpenChooseView(null, cc.LodeType.DanhDe);
              break;
          }
  
          break;
  
        // ba cang
        case 2:
          if (this.editTongCuoc.string.length < 1) {
            this.editTongCuoc.string = this.arrPayBetType3Cang[0];
            this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
              this.arrWinBetType3Cang[0] * 1000
            );
          }
  
          this.typeBet = cc.LodeType.BaCang;
          cc.LodeController.getInstance()
            .getLodeView()
            .onOpenChooseView(null, cc.LodeType.BaCang);
          break;
  
        // dau duoi
        case 3:
          switch (this.nodeChildBetTypeLoDeIndex) {
            // dau
            case 0:
              if (this.editTongCuoc.string.length < 1) {
                this.editTongCuoc.string = this.arrPayBetTypeDauDuoi[0];
                this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
                  this.arrWinBetTypeDauDuoi[0] * 1000
                );
              }
  
              this.typeBet = cc.LodeType.Dau;
              cc.LodeController.getInstance()
                .getLodeView()
                .onOpenChooseView(null, cc.LodeType.Dau);
              break;
  
            // duoi
            case 1:
              if (this.editTongCuoc.string.length < 1) {
                this.editTongCuoc.string = this.arrPayBetTypeDauDuoi[1];
                this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
                  this.arrWinBetTypeDauDuoi[1] * 1000
                );
              }
  
              this.typeBet = cc.LodeType.Duoi;
              cc.LodeController.getInstance()
                .getLodeView()
                .onOpenChooseView(null, cc.LodeType.Duoi);
              break;
          }
  
          break;
  
        // lo xien
        case 4:
          switch (this.nodeChildBetTypeLoDeIndex) {
            // xien 2
            case 0:
              if (this.editTongCuoc.string.length < 1) {
                this.editTongCuoc.string = this.arrPayBetTypeLoXien[0];
                this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
                  this.arrWinBetTypeLoXien[0] * 1000
                );
              }
  
              this.typeBet = cc.LodeType.Xien2;
              cc.LodeController.getInstance()
                .getLodeView()
                .onOpenChooseView(null, cc.LodeType.Xien2);
              break;
  
            // xien 3
            case 1:
              if (this.editTongCuoc.string.length < 1) {
                this.editTongCuoc.string = this.arrPayBetTypeLoXien[1];
                this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
                  this.arrWinBetTypeLoXien[1] * 1000
                );
              }
  
              this.typeBet = cc.LodeType.Xien3;
              cc.LodeController.getInstance()
                .getLodeView()
                .onOpenChooseView(null, cc.LodeType.Xien3);
              break;
  
            // xien 4
            case 2:
              if (this.editTongCuoc.string.length < 1) {
                this.editTongCuoc.string = this.arrPayBetTypeLoXien[2];
                this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
                  this.arrWinBetTypeLoXien[2] * 1000
                );
              }
  
              this.typeBet = cc.LodeType.Xien4;
              cc.LodeController.getInstance()
                .getLodeView()
                .onOpenChooseView(null, cc.LodeType.Xien4);
              break;
          }
  
          break;
      }
    }
    else if(this.Area == 2){
      switch (this.nodeBetTypeLoDeIndex) {
        // bao lo
        case 0:
          switch (this.nodeChildBetTypeLoDeIndex) {
            // lo 2 so
            case 0:
              if (this.editTongCuoc.string.length < 1) {
                this.editTongCuoc.string = this.arrPayBetTypeBaoLoMienTrung[0];
                this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
                  this.arrWinBetTypeBaoLoMienTrung[0] * 1000
                );
              }
  
              this.typeBet = cc.LodeType.Lo2SoMienTrung;
              cc.LodeController.getInstance()
                .getLodeView()
                .onOpenChooseView(null, cc.LodeType.Lo2SoMienTrung);
              break;
  
            // lo 3 so
            case 1:
              if (this.editTongCuoc.string.length < 1) {
                this.editTongCuoc.string = this.arrPayBetTypeBaoLoMienTrung[1];
                this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
                  this.arrWinBetTypeBaoLoMienTrung[1] * 1000
                );
              }
  
              this.typeBet = cc.LodeType.Lo3SoMienTrung;
              cc.LodeController.getInstance()
                .getLodeView()
                .onOpenChooseView(null, cc.LodeType.Lo3SoMienTrung);
              break;
          }
  
          break;
  
        // danh de
        case 1:
          
          switch (this.nodeChildBetTypeLoDeIndex) {
            // de dau
            case 0:
              if (this.editTongCuoc.string.length < 1) {
                this.editTongCuoc.string = this.arrPayBetTypeDanhDeMienTrung[0];
                this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
                  this.arrWinBetTypeDanhDeMienTrung[0] * 1000
                );
              }
      
              this.typeBet = cc.LodeType.DeDauMienTrung;
              cc.LodeController.getInstance()
                .getLodeView()
                .onOpenChooseView(null, cc.LodeType.DeDauMienTrung);
              break;
  
            // de dac biet
            case 1:
              if (this.editTongCuoc.string.length < 1) {
                this.editTongCuoc.string = this.arrPayBetTypeDanhDeMienTrung[1];
                this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
                  this.arrWinBetTypeDanhDeMienTrung[1] * 1000
                );
              }
      
              this.typeBet = cc.LodeType.DanhDeMienTrung;
              cc.LodeController.getInstance()
                .getLodeView()
                .onOpenChooseView(null, cc.LodeType.DanhDeMienTrung);
              break;
          }
  
          break;
  
        // ba cang
        case 2:
          
          switch (this.nodeChildBetTypeLoDeIndex) {
            // 3 cang dau
            case 0:
              if (this.editTongCuoc.string.length < 1) {
                this.editTongCuoc.string = this.arrPayBetType3CangMienTrung[0];
                this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
                  this.arrWinBetType3CangMienTrung[0] * 1000
                );
              }
      
              this.typeBet = cc.LodeType.BaCangDauMienTrung;
              cc.LodeController.getInstance()
                .getLodeView()
                .onOpenChooseView(null, cc.LodeType.BaCangDauMienTrung);
              break;
  
            // de dac biet
            case 1:
              if (this.editTongCuoc.string.length < 1) {
                this.editTongCuoc.string = this.arrPayBetType3CangMienTrung[1];
                this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
                  this.arrWinBetType3CangMienTrung[1] * 1000
                );
              }
      
              this.typeBet = cc.LodeType.BaCangDuoiMienTrung;
              cc.LodeController.getInstance()
                .getLodeView()
                .onOpenChooseView(null, cc.LodeType.BaCangDuoiMienTrung);
              break;
            case 2:
              if (this.editTongCuoc.string.length < 1) {
                this.editTongCuoc.string = this.arrPayBetType3CangMienTrung[2];
                this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
                  this.arrWinBetType3CangMienTrung[2] * 1000
                );
              }
      
              this.typeBet = cc.LodeType.BaCangDauDuoiMienTrung;
              cc.LodeController.getInstance()
                .getLodeView()
                .onOpenChooseView(null, cc.LodeType.BaCangDauDuoiMienTrung);
              break;
          }
  
        // dau duoi
        case 3:
          switch (this.nodeChildBetTypeLoDeIndex) {
            // dau
            case 0:
              if (this.editTongCuoc.string.length < 1) {
                this.editTongCuoc.string = this.arrPayBetTypeDauDuoiMienTrung[0];
                this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
                  this.arrWinBetTypeDauDuoiMienTrung[0] * 1000
                );
              }
  
              this.typeBet = cc.LodeType.DauMienTrung;
              cc.LodeController.getInstance()
                .getLodeView()
                .onOpenChooseView(null, cc.LodeType.DauMienTrung);
              break;
  
            // duoi
            case 1:
              if (this.editTongCuoc.string.length < 1) {
                this.editTongCuoc.string = this.arrPayBetTypeDauDuoiMienTrung[1];
                this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
                  this.arrWinBetTypeDauDuoiMienTrung[1] * 1000
                );
              }
  
              this.typeBet = cc.LodeType.DuoiMienTrung;
              cc.LodeController.getInstance()
                .getLodeView()
                .onOpenChooseView(null, cc.LodeType.DuoiMienTrung);
              break;
          }
  
          break;
  
        // lo xien
        case 4:
          switch (this.nodeChildBetTypeLoDeIndex) {
            // xien 2
            case 0:
              if (this.editTongCuoc.string.length < 1) {
                this.editTongCuoc.string = this.arrPayBetTypeLoXienMienTrung[0];
                this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
                  this.arrWinBetTypeLoXienMienTrung[0] * 1000
                );
              }
  
              this.typeBet = cc.LodeType.Xien2MienTrung;
              cc.LodeController.getInstance()
                .getLodeView()
                .onOpenChooseView(null, cc.LodeType.Xien2MienTrung);
              break;
  
            // xien 3
            case 1:
              if (this.editTongCuoc.string.length < 1) {
                this.editTongCuoc.string = this.arrPayBetTypeLoXienMienTrung[1];
                this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
                  this.arrWinBetTypeLoXienMienTrung[1] * 1000
                );
              }
  
              this.typeBet = cc.LodeType.Xien3MienTrung;
              cc.LodeController.getInstance()
                .getLodeView()
                .onOpenChooseView(null, cc.LodeType.Xien3MienTrung);
              break;
  
            // xien 4
            case 2:
              if (this.editTongCuoc.string.length < 1) {
                this.editTongCuoc.string = this.arrPayBetTypeLoXienMienTrung[2];
                this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
                  this.arrWinBetTypeLoXienMienTrung[2] * 1000
                );
              }
  
              this.typeBet = cc.LodeType.Xien4MienTrung;
              cc.LodeController.getInstance()
                .getLodeView()
                .onOpenChooseView(null, cc.LodeType.Xien4MienTrung);
              break;
          }
  
          break;
      }
    }
    else{
      switch (this.nodeBetTypeLoDeIndex) {
        // bao lo
        case 0:
          switch (this.nodeChildBetTypeLoDeIndex) {
            // lo 2 so
            case 0:
              if (this.editTongCuoc.string.length < 1) {
                this.editTongCuoc.string = this.arrPayBetTypeBaoLoMienNam[0];
                this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
                  this.arrWinBetTypeBaoLoMienNam[0] * 1000
                );
              }
  
              this.typeBet = cc.LodeType.Lo2SoMienNam;
              cc.LodeController.getInstance()
                .getLodeView()
                .onOpenChooseView(null, cc.LodeType.Lo2SoMienNam);
              break;
  
            // lo 3 so
            case 1:
              if (this.editTongCuoc.string.length < 1) {
                this.editTongCuoc.string = this.arrPayBetTypeBaoLoMienNam[1];
                this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
                  this.arrWinBetTypeBaoLoMienNam[1] * 1000
                );
              }
  
              this.typeBet = cc.LodeType.Lo3SoMienNam;
              cc.LodeController.getInstance()
                .getLodeView()
                .onOpenChooseView(null, cc.LodeType.Lo3SoMienNam);
              break;
          }
  
          break;
  
        // danh de
        case 1:
          
          switch (this.nodeChildBetTypeLoDeIndex) {
            // de dau
            case 0:
              if (this.editTongCuoc.string.length < 1) {
                this.editTongCuoc.string = this.arrPayBetTypeDanhDeMienNam[0];
                this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
                  this.arrWinBetTypeDanhDeMienNam[0] * 1000
                );
              }
      
              this.typeBet = cc.LodeType.DeDauMienNam;
              cc.LodeController.getInstance()
                .getLodeView()
                .onOpenChooseView(null, cc.LodeType.DeDauMienNam);
              break;
  
            // de dac biet
            case 1:
              if (this.editTongCuoc.string.length < 1) {
                this.editTongCuoc.string = this.arrPayBetTypeDanhDeMienNam[1];
                this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
                  this.arrWinBetTypeDanhDeMienNam[1] * 1000
                );
              }
      
              this.typeBet = cc.LodeType.DanhDeMienNam;
              cc.LodeController.getInstance()
                .getLodeView()
                .onOpenChooseView(null, cc.LodeType.DanhDeMienNam);
              break;
              // de dau duoi
            case 2:
              if (this.editTongCuoc.string.length < 1) {
                this.editTongCuoc.string = this.arrPayBetTypeDanhDeMienNam[2];
                this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
                  this.arrWinBetTypeDanhDeMienNam[2] * 1000
                );
              }
      
              this.typeBet = cc.LodeType.DeDauDuoiMienNam;
              cc.LodeController.getInstance()
                .getLodeView()
                .onOpenChooseView(null, cc.LodeType.DeDauDuoiMienNam);
              break;
          }
  
          break;
  
        // ba cang
        case 2:
          
          switch (this.nodeChildBetTypeLoDeIndex) {
            // xiu chu dau
            case 0:
              if (this.editTongCuoc.string.length < 1) {
                this.editTongCuoc.string = this.arrPayBetTypeXiuChuMienNam[0];
                this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
                  this.arrWinBetTypeXiuChuMienNam[0] * 1000
                );
              }
      
              this.typeBet = cc.LodeType.XiuChuDauMienNam;
              cc.LodeController.getInstance()
                .getLodeView()
                .onOpenChooseView(null, cc.LodeType.XiuChuDauMienNam);
              break;
  
            // xiu chu duoi
            case 1:
              if (this.editTongCuoc.string.length < 1) {
                this.editTongCuoc.string = this.arrPayBetTypeXiuChuMienNam[1];
                this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
                  this.arrWinBetTypeXiuChuMienNam[1] * 1000
                );
              }
      
              this.typeBet = cc.LodeType.XiuChuDuoiMienNam;
              cc.LodeController.getInstance()
                .getLodeView()
                .onOpenChooseView(null, cc.LodeType.XiuChuDuoiMienNam);
              break;
              // xiu chu dau duoi
            case 2:
              if (this.editTongCuoc.string.length < 1) {
                this.editTongCuoc.string = this.arrPayBetTypeXiuChuMienNam[2];
                this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
                  this.arrWinBetTypeXiuChuMienNam[2] * 1000
                );
              }
      
              this.typeBet = cc.LodeType.XiuChuDauDuoiMienNam;
              cc.LodeController.getInstance()
                .getLodeView()
                .onOpenChooseView(null, cc.LodeType.XiuChuDauDuoiMienNam);
              break;
          }
  
        // dau duoi
        case 3:
          switch (this.nodeChildBetTypeLoDeIndex) {
            // dau
            case 0:
              if (this.editTongCuoc.string.length < 1) {
                this.editTongCuoc.string = this.arrPayBetTypeDauDuoiMienNam[0];
                this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
                  this.arrWinBetTypeDauDuoiMienNam[0] * 1000
                );
              }
  
              this.typeBet = cc.LodeType.DauMienNam;
              cc.LodeController.getInstance()
                .getLodeView()
                .onOpenChooseView(null, cc.LodeType.DauMienNam);
              break;
  
            // duoi
            case 1:
              if (this.editTongCuoc.string.length < 1) {
                this.editTongCuoc.string = this.arrPayBetTypeDauDuoiMienNam[1];
                this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
                  this.arrWinBetTypeDauDuoiMienNam[1] * 1000
                );
              }
  
              this.typeBet = cc.LodeType.DuoiMienNam;
              cc.LodeController.getInstance()
                .getLodeView()
                .onOpenChooseView(null, cc.LodeType.DuoiMienNam);
              break;
          }
  
          break;
  
        // lô đá
        case 4:
          switch (this.nodeChildBetTypeLoDeIndex) {
            // lô đá 2
            case 0:
              if (this.editTongCuoc.string.length < 1) {
                this.editTongCuoc.string = this.arrPayBetTypeLoDaMienNam[0];
                this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
                  this.arrWinBetTypeLoDaMienNam[0] * 1000
                );
              }
  
              this.typeBet = cc.LodeType.LoDa2MienNam;
              cc.LodeController.getInstance()
                .getLodeView()
                .onOpenChooseView(null, cc.LodeType.LoDa2MienNam);
              break;
  
            // lô đá 3
            case 1:
              if (this.editTongCuoc.string.length < 1) {
                this.editTongCuoc.string = this.arrPayBetTypeLoDaMienNam[1];
                this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
                  this.arrWinBetTypeLoDaMienNam[1] * 1000
                );
              }
  
              this.typeBet = cc.LodeType.LoDa3MienNam;
              cc.LodeController.getInstance()
                .getLodeView()
                .onOpenChooseView(null, cc.LodeType.LoDa3MienNam);
              break;
  
            // lô đá 4
            case 2:
              if (this.editTongCuoc.string.length < 1) {
                this.editTongCuoc.string = this.arrPayBetTypeLoDaMienNam[2];
                this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
                  this.arrWinBetTypeLoDaMienNam[2] * 1000
                );
              }
  
              this.typeBet = cc.LodeType.LoDa4MienNam;
              cc.LodeController.getInstance()
                .getLodeView()
                .onOpenChooseView(null, cc.LodeType.LoDa4MienNam);
              break;
          }
  
          break;
      }
    }
  },

  onReturnedTienCuoc1Con: function (event, data) {
    if (event.string.length < 1) {
      return;
    }

    let number = Number(event.string);

    if (number < 1) {
      this.editTienCuoc1Con.string = "1";
      return;
    }

    let multiply = 1;
    let win = 1;

    switch (this.nodeBetTypeLoDeIndex) {
      // bao lo
      case 0:
        
        if (this.Area == 1) {
          multiply = this.arrPayBetTypeBaoLo[this.nodeChildBetTypeLoDeIndex];
          win = this.arrWinBetTypeBaoLo[this.nodeChildBetTypeLoDeIndex];
        }
        else if(this.Area == 2){
          multiply = this.arrPayBetTypeBaoLoMienTrung[this.nodeChildBetTypeLoDeIndex];
          win = this.arrWinBetTypeBaoLoMienTrung[this.nodeChildBetTypeLoDeIndex];
        }
        else{
          multiply = this.arrPayBetTypeBaoLoMienNam[this.nodeChildBetTypeLoDeIndex];
          win = this.arrWinBetTypeBaoLoMienNam[this.nodeChildBetTypeLoDeIndex];
        }
        break;

      // danh de
      case 1:
        
        if (this.Area == 1) {
          multiply = this.arrPayBetTypeDanhDe[this.nodeChildBetTypeLoDeIndex];
        win = this.arrWinBetTypeDanhDe[this.nodeChildBetTypeLoDeIndex];
        }
        else if(this.Area == 2){
          multiply = this.arrPayBetTypeDanhDeMienTrung[this.nodeChildBetTypeLoDeIndex];
          win = this.arrWinBetTypeDanhDeMienTrung[this.nodeChildBetTypeLoDeIndex];
        }
        else{
          multiply = this.arrPayBetTypeDanhDeMienNam[this.nodeChildBetTypeLoDeIndex];
          win = this.arrWinBetTypeDanhDeMienNam[this.nodeChildBetTypeLoDeIndex];
        }
        break;

      // ba cang
      case 2:
       
        if (this.Area == 1) {
          multiply = this.arrPayBetType3Cang[this.nodeChildBetTypeLoDeIndex];
          win = this.arrWinBetType3Cang[this.nodeChildBetTypeLoDeIndex];
        }
        else if(this.Area == 2){
          multiply = this.arrPayBetType3CangMienTrung[this.nodeChildBetTypeLoDeIndex];
          win = this.arrWinBetType3CangMienTrung[this.nodeChildBetTypeLoDeIndex];
        }
        else{
          multiply = this.arrPayBetTypeLoDaMienNam[this.nodeChildBetTypeLoDeIndex];
          win = this.arrWinBetTypeLoDaMienNam[this.nodeChildBetTypeLoDeIndex];
        }
        break;

      // dau duoi
      case 3:
        
        if (this.Area == 1) {
          multiply = this.arrPayBetTypeDauDuoi[this.nodeChildBetTypeLoDeIndex];
          win = this.arrWinBetTypeDauDuoi[this.nodeChildBetTypeLoDeIndex];
        }
        else if(this.Area == 2){
          multiply = this.arrPayBetTypeDauDuoiMienTrung[this.nodeChildBetTypeLoDeIndex];
          win = this.arrWinBetTypeDauDuoiMienTrung[this.nodeChildBetTypeLoDeIndex];
        }
        else{
          multiply = this.arrPayBetTypeDauDuoiMienNam[this.nodeChildBetTypeLoDeIndex];
          win = this.arrWinBetTypeDauDuoiMienNam[this.nodeChildBetTypeLoDeIndex];
        }
        break;

      // lo xien
      case 4:
       
        if (this.Area == 1) {
          multiply = this.arrPayBetTypeLoXien[this.nodeChildBetTypeLoDeIndex];
          win = this.arrWinBetTypeLoXien[this.nodeChildBetTypeLoDeIndex];
        }
        else if(this.Area == 2){
          multiply = this.arrPayBetTypeLoXienMienTrung[this.nodeChildBetTypeLoDeIndex];
          win = this.arrWinBetTypeLoXienMienTrung[this.nodeChildBetTypeLoDeIndex];
        }
        else{
          
          multiply = this.arrPayBetTypeXiuChuMienNam[this.nodeChildBetTypeLoDeIndex];
          win = this.arrWinBetTypeXiuChuMienNam[this.nodeChildBetTypeLoDeIndex];
        }
        break;
    }
    let numberChoosen = 1;
    let numberChooses = cc.LodeController.getInstance().getNumberChooses();
    if (this.nodeBetTypeLoDeIndex != 4 && this.nodeBetTypeLoDeIndex != 3) {
      if (numberChooses && numberChooses.length > 1) {
        numberChoosen = numberChooses.length;
      }
    }
    this.editTongCuoc.string = number * multiply * numberChoosen;
    this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
      number * win * 1000
    );
    this.userBet = number * multiply * 1000;
  },

  onReturnedTongCuoc: function (event, data) {
    if (event.string.length < 1) {
      return;
    }

    let number = Number(event.string);

    if (number < 1) {
      this.editTongCuoc.string = "1";
      return;
    }

    let divider = 1;
    let win = 1;

    switch (this.nodeBetTypeLoDeIndex) {
      // bao lo
      case 0:
        if (this.Area == 1) {
          divider = this.arrPayBetTypeBaoLo[this.nodeChildBetTypeLoDeIndex];
          win = this.arrWinBetTypeBaoLo[this.nodeChildBetTypeLoDeIndex];
        }
        else if(this.Area == 2){
          divider = this.arrPayBetTypeBaoLoMienTrung[this.nodeChildBetTypeLoDeIndex];
          win = this.arrWinBetTypeBaoLoMienTrung[this.nodeChildBetTypeLoDeIndex];
        }
        else{
          divider = this.arrPayBetTypeBaoLoMienNam[this.nodeChildBetTypeLoDeIndex];
          win = this.arrWinBetTypeBaoLoMienNam[this.nodeChildBetTypeLoDeIndex];
        }
        break;

      // danh de
      case 1:

        if (this.Area == 1) {
          divider = this.arrPayBetTypeDanhDe[this.nodeChildBetTypeLoDeIndex];
        win = this.arrWinBetTypeDanhDe[this.nodeChildBetTypeLoDeIndex];
        }
        else if(this.Area == 2){
          divider = this.arrPayBetTypeDanhDeMienTrung[this.nodeChildBetTypeLoDeIndex];
          win = this.arrWinBetTypeDanhDeMienTrung[this.nodeChildBetTypeLoDeIndex];
        }
        else{
          divider = this.arrPayBetTypeDanhDeMienNam[this.nodeChildBetTypeLoDeIndex];
          win = this.arrWinBetTypeDanhDeMienNam[this.nodeChildBetTypeLoDeIndex];
        }
        break;

      // ba cang
      case 2:
        if (this.Area == 1) {
          divider = this.arrPayBetType3Cang[this.nodeChildBetTypeLoDeIndex];
          win = this.arrWinBetType3Cang[this.nodeChildBetTypeLoDeIndex];
        }
        else if(this.Area == 2){
          divider = this.arrPayBetType3CangMienTrung[this.nodeChildBetTypeLoDeIndex];
          win = this.arrWinBetType3CangMienTrung[this.nodeChildBetTypeLoDeIndex];
        }
        else{
          divider = this.arrPayBetTypeLoDaMienNam[this.nodeChildBetTypeLoDeIndex];
          win = this.arrWinBetTypeLoDaMienNam[this.nodeChildBetTypeLoDeIndex];
        }
        break;

      // dau duoi
      case 3:
        if (this.Area == 1) {
          divider = this.arrPayBetTypeDauDuoi[this.nodeChildBetTypeLoDeIndex];
          win = this.arrWinBetTypeDauDuoi[this.nodeChildBetTypeLoDeIndex];
        }
        else if(this.Area == 2){
          divider = this.arrPayBetTypeDauDuoiMienTrung[this.nodeChildBetTypeLoDeIndex];
          win = this.arrWinBetTypeDauDuoiMienTrung[this.nodeChildBetTypeLoDeIndex];
        }
        else{
          divider = this.arrPayBetTypeDauDuoiMienNam[this.nodeChildBetTypeLoDeIndex];
          win = this.arrWinBetTypeDauDuoiMienNam[this.nodeChildBetTypeLoDeIndex];
        }
        break;

      // lo xien
      case 4:
        if (this.Area == 1) {
          divider = this.arrPayBetTypeLoXien[this.nodeChildBetTypeLoDeIndex];
          win = this.arrWinBetTypeLoXien[this.nodeChildBetTypeLoDeIndex]; 
        }
        else if(this.Area == 2){
          divider = this.arrPayBetTypeLoXienMienTrung[this.nodeChildBetTypeLoDeIndex];
          win = this.arrWinBetTypeLoXienMienTrung[this.nodeChildBetTypeLoDeIndex];
        }
        else{
          divider = this.arrPayBetTypeXiuChuMienNam[this.nodeChildBetTypeLoDeIndex];
          win = this.arrWinBetTypeXiuChuMienNam[this.nodeChildBetTypeLoDeIndex];
          
        }
        break;
    }

    let value = number / divider;
    this.editTienCuoc1Con.string = value;
    this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
      value * win * 1000
    );
    this.userBet = number * 1000;
  },

  openChildBetBaoLo: function (event, data) {
    this.editTienCuoc1Con.string = "1";
    let number = Number(data);
    this.nodeChildBetTypeLoDeIndex = number;
    let betAmount = 0;
    let winAmount = 0;
    if (this.Area == 1) {
      betAmount = this.arrPayBetTypeBaoLo[this.nodeChildBetTypeLoDeIndex];
      winAmount = this.arrWinBetTypeBaoLo[this.nodeChildBetTypeLoDeIndex];
    }
    else if(this.Area == 2){
      betAmount = this.arrPayBetTypeBaoLoMienTrung[this.nodeChildBetTypeLoDeIndex];
      winAmount = this.arrWinBetTypeBaoLoMienTrung[this.nodeChildBetTypeLoDeIndex];
    }
    else{
      betAmount = this.arrPayBetTypeBaoLoMienNam[this.nodeChildBetTypeLoDeIndex];
      winAmount = this.arrWinBetTypeBaoLoMienNam[this.nodeChildBetTypeLoDeIndex];
    }
    this.lbNote.string = 'Thanh toán <color=yellow>' + betAmount+ '</color> lô. Đặt <color=yellow>1</color> ăn <color=yellow>' + winAmount + '</color>';
    this.updateNumberChoose("");

    if (this.editTongCuoc.string.length < 1) {
      this.editTongCuoc.string = betAmount;
      this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
        winAmount * 1000
      );
    } else {
      this.editTongCuoc.string = betAmount;
      let win = winAmount;
      this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
        Number(this.editTienCuoc1Con.string) * win * 1000
      );
    }

    this.userBet = Number(this.editTongCuoc.string) * 1000;
    if (this.Area == 1) {
      for (let i = 0; i < this.nodeBetBaoLo.length; i++) {
        this._setActiveChildBet(this.nodeBetBaoLo[i], i === number);
      }
    }
    else if(this.Area == 2){
      for (let i = 0; i < this.nodeBetBaoLoMienTrung.length; i++) {
        this._setActiveChildBet(this.nodeBetBaoLoMienTrung[i], i === number);
      }
    }
    else{
      for (let i = 0; i < this.nodeBetBaoLoMienNam.length; i++) {
        this._setActiveChildBet(this.nodeBetBaoLoMienNam[i], i === number);
      }
    }
    
  },

  openChildBetDanhDe: function (event, data) {
    this.editTienCuoc1Con.string = "1";
    let number = Number(data);
    this.nodeChildBetTypeLoDeIndex = number;
    let betAmount = 0;
    let winAmount = 0;
    if (this.Area == 1) {
      betAmount = this.arrPayBetTypeDanhDe[this.nodeChildBetTypeLoDeIndex];
      winAmount = this.arrWinBetTypeDanhDe[this.nodeChildBetTypeLoDeIndex];
    }
    else if(this.Area == 2){
      betAmount = this.arrPayBetTypeDanhDeMienTrung[this.nodeChildBetTypeLoDeIndex];
      winAmount = this.arrWinBetTypeDanhDeMienTrung[this.nodeChildBetTypeLoDeIndex];
    }
    else{
      betAmount = this.arrPayBetTypeDanhDeMienNam[this.nodeChildBetTypeLoDeIndex];
      winAmount = this.arrWinBetTypeDanhDeMienNam[this.nodeChildBetTypeLoDeIndex];
    }
    this.lbNote.string = 'Thanh toán <color=yellow>' + betAmount + '</color> lô. Đặt <color=yellow>1</color> ăn <color=yellow>' + winAmount + '</color>';
    this.updateNumberChoose("");

    if (this.editTongCuoc.string.length < 1) {
      this.editTongCuoc.string = betAmount;
      this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
        winAmount * 1000
      );
    } else {
      let win = winAmount;
      this.editTongCuoc.string = betAmount;
      this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
        Number(this.editTienCuoc1Con.string) * win * 1000
      );
    }

    this.userBet = Number(this.editTongCuoc.string) * 1000;
    if (this.Area == 1) {
      for (let i = 0; i < this.nodeBetDanhDe.length; i++) {
        this._setActiveChildBet(this.nodeBetDanhDe[i], i === number);
      }
    }
    else if(this.Area == 2){
      for (let i = 0; i < this.nodeBetDanhDeMienTrung.length; i++) {
        this._setActiveChildBet(this.nodeBetDanhDeMienTrung[i], i === number);
      }
    }
    else{
      for (let i = 0; i < this.nodeBetDanhDeMienNam.length; i++) {
        this._setActiveChildBet(this.nodeBetDanhDeMienNam[i], i === number);
      }
    }
    
  },

  openChildBetBaCang: function (event, data) {
    this.editTienCuoc1Con.string = "1";
    let number = Number(data);
    this.nodeChildBetTypeLoDeIndex = number;
    let betAmount = 0;
    let winAmount = 0;
    if (this.Area == 1) {
      betAmount = this.arrPayBetType3Cang[this.nodeChildBetTypeLoDeIndex];
      winAmount = this.arrWinBetType3Cang[this.nodeChildBetTypeLoDeIndex];
    }
    else if(this.Area == 2){
      betAmount = this.arrPayBetType3CangMienTrung[this.nodeChildBetTypeLoDeIndex];
      winAmount = this.arrWinBetType3CangMienTrung[this.nodeChildBetTypeLoDeIndex];
    }
    else{
      betAmount = this.arrPayBetTypeXiuChuMienNam[this.nodeChildBetTypeLoDeIndex];
      winAmount = this.arrWinBetTypeXiuChuMienNam[this.nodeChildBetTypeLoDeIndex];
    }
    this.lbNote.string = 'Thanh toán <color=yellow>' + betAmount + '</color> lô. Đặt <color=yellow>1</color> ăn <color=yellow>' + winAmount + '</color>';
    this.updateNumberChoose("");

    if (this.editTongCuoc.string.length < 1) {
      this.editTongCuoc.string = betAmount;
      this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
        winAmount * 1000
      );
    } else {
      this.editTongCuoc.string = betAmount;
      let win = winAmount;
      this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
        Number(this.editTienCuoc1Con.string) * win * 1000
      );
    }

    this.userBet = Number(this.editTongCuoc.string) * 1000;
    if (this.Area == 1) {
      for (let i = 0; i < this.nodeBetBaCang.length; i++) {
        this._setActiveChildBet(this.nodeBetBaCang[i], i === number);
      }
    }
    else if(this.Area == 2){
      for (let i = 0; i < this.nodeBetBaCangMienTrung.length; i++) {
        this._setActiveChildBet(this.nodeBetBaCangMienTrung[i], i === number);
      }
    }
    else{
      for (let i = 0; i < this.nodeBetXiuChuMienNam.length; i++) {
        this._setActiveChildBet(this.nodeBetXiuChuMienNam[i], i === number);
      }
    }
    
  },

  openChildBetDauDuoi: function (event, data) {
    this.editTienCuoc1Con.string = "1";
    let number = Number(data);
    this.nodeChildBetTypeLoDeIndex = number;
    let betAmount = 0;
    let winAmount = 0;
    if (this.Area == 1) {
      betAmount = this.arrPayBetTypeDauDuoi[this.nodeChildBetTypeLoDeIndex];
      winAmount = this.arrWinBetTypeDauDuoi[this.nodeChildBetTypeLoDeIndex];
    }
    else if(this.Area == 2){
      betAmount = this.arrPayBetTypeDauDuoiMienTrung[this.nodeChildBetTypeLoDeIndex];
      winAmount = this.arrWinBetTypeDauDuoiMienTrung[this.nodeChildBetTypeLoDeIndex];
    }
    else{
      betAmount = this.arrPayBetTypeDauDuoiMienNam[this.nodeChildBetTypeLoDeIndex];
      winAmount = this.arrWinBetTypeDauDuoiMienNam[this.nodeChildBetTypeLoDeIndex];
    }
    this.lbNote.string = 'Thanh toán <color=yellow>' + betAmount + '</color> lô. Đặt <color=yellow>1</color> ăn <color=yellow>' + winAmount + '</color>';
    this.updateNumberChoose("");

    if (this.editTongCuoc.string.length < 1) {
      this.editTongCuoc.string = betAmount;
      this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
        winAmount * 1000
      );
    } else {
      this.editTongCuoc.string = betAmount;
      let win = winAmount;
      this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
        Number(this.editTienCuoc1Con.string) * win * 1000
      );
    }

    this.userBet = Number(this.editTongCuoc.string) * 1000;
    if (this.Area == 1) {
      for (let i = 0; i < this.nodeBetDauDuoi.length; i++) {
        this._setActiveChildBet(this.nodeBetDauDuoi[i], i === number);
      }
    }
    else if(this.Area == 2){
      for (let i = 0; i < this.nodeBetDauDuoiMienTrung.length; i++) {
        this._setActiveChildBet(this.nodeBetDauDuoiMienTrung[i], i === number);
      }
    }
    else{
      for (let i = 0; i < this.nodeBetDauDuoiMienNam.length; i++) {
        this._setActiveChildBet(this.nodeBetDauDuoiMienNam[i], i === number);
      }
    }
    
  },

  openChildBetLoXien: function (event, data) {
    this.editTienCuoc1Con.string = "1";
    let number = Number(data);
    this.nodeChildBetTypeLoDeIndex = number;
    let betAmount = 0;
    let winAmount = 0;
    if (this.Area == 1) {
      betAmount = this.arrPayBetTypeLoXien[this.nodeChildBetTypeLoDeIndex];
      winAmount = this.arrWinBetTypeLoXien[this.nodeChildBetTypeLoDeIndex];
    }
    else if(this.Area == 2){
      betAmount = this.arrPayBetTypeLoXienMienTrung[this.nodeChildBetTypeLoDeIndex];
      winAmount = this.arrWinBetTypeLoXienMienTrung[this.nodeChildBetTypeLoDeIndex];
    }
    else{
      betAmount = this.arrPayBetTypeLoDaMienNam[this.nodeChildBetTypeLoDeIndex];
      winAmount = this.arrWinBetTypeLoDaMienNam[this.nodeChildBetTypeLoDeIndex];
    }
    this.lbNote.string = 'Thanh toán <color=yellow>' + betAmount + '</color> lô. Đặt <color=yellow>1</color> ăn <color=yellow>' + winAmount + '</color>';
    this.updateNumberChoose("");

    if (this.editTongCuoc.string.length < 1) {
      this.editTongCuoc.string = betAmount;
      this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
        winAmount * 1000
      );
    } else {
      this.editTongCuoc.string = betAmount;
      let win = winAmount;
      this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
        Number(this.editTienCuoc1Con.string) * win * 1000
      );
    }

    this.userBet = Number(this.editTongCuoc.string) * 1000;
    if (this.Area == 1) {
      for (let i = 0; i < this.nodeBetLoXien.length; i++) {
        this._setActiveChildBet(this.nodeBetLoXien[i], i === number);
      }
    }
    else if(this.Area == 2){
      for (let i = 0; i < this.nodeBetLoXienMienTrung.length; i++) {
        this._setActiveChildBet(this.nodeBetLoXienMienTrung[i], i === number);
      }
    }
    else{
      for (let i = 0; i < this.nodeBetLoDaMienNam.length; i++) {
        this._setActiveChildBet(this.nodeBetLoDaMienNam[i], i === number);
      }
    }
    
  },

  openGuideClicked: function (event, data) {
    this.aniGuide.play("showGuide");
    if (this.Area == 1) {
      for (let i = 0; i < this.nodeGuides.length; i++) {
        this.nodeGuides[i].active = false;
      }
  
      if (this.nodeGuideLoDeIndex > -1) {
        // if (this.nodeGuideLoDeIndex == 1 || this.nodeGuideLoDeIndex == 0) {
        //   for (let i = 0; i < this.nodeGuides.length; i++) {
        //     this.nodeGuides[i].active = i == this.nodeGuideLoDeIndex;
        //   }
        // }
        if (this.nodeGuideLoDeIndex == 0) {
          if (this.nodeChildBetTypeLoDeIndex == 0) {
            this.nodeGuides[0].active = true;
          }
          else{
            this.nodeGuides[8].active = true;
          }
        }
        if (this.nodeGuideLoDeIndex == 1) {
          if (this.nodeChildBetTypeLoDeIndex == 0) {
            this.nodeGuides[9].active = true;
          }
          else{
            this.nodeGuides[1].active = true;
          }
        }
        if (this.nodeGuideLoDeIndex == 2) {
          this.nodeGuides[2].active = true;
        }
        if (this.nodeGuideLoDeIndex == 3) {
          if (this.nodeChildBetTypeLoDeIndex == 0) {
            this.nodeGuides[3].active = true;
          }
          else{
            this.nodeGuides[4].active = true;
          }
        }
        if (this.nodeGuideLoDeIndex == 4) {
          if (this.nodeChildBetTypeLoDeIndex == 0) {
            this.nodeGuides[5].active = true;
          }
          else if(this.nodeChildBetTypeLoDeIndex == 1){
            this.nodeGuides[6].active = true;
          }
          else{
            this.nodeGuides[7].active = true;
          }
        }
        
      }
    }
    else if(this.Area == 2){
      for (let i = 0; i < this.nodeGuidesMienTrung.length; i++) {
        this.nodeGuidesMienTrung[i].active = false;
      }
  
      if (this.nodeGuideLoDeIndex > -1) {
        // if (this.nodeGuideLoDeIndex == 1 || this.nodeGuideLoDeIndex == 0) {
        //   for (let i = 0; i < this.nodeGuides.length; i++) {
        //     this.nodeGuides[i].active = i == this.nodeGuideLoDeIndex;
        //   }
        // }
        if (this.nodeGuideLoDeIndex == 0) {
          if (this.nodeChildBetTypeLoDeIndex == 0) {
            this.nodeGuidesMienTrung[0].active = true;
          }
          else{
            this.nodeGuidesMienTrung[1].active = true;
          }
        }
        if (this.nodeGuideLoDeIndex == 1) {
          if (this.nodeChildBetTypeLoDeIndex == 0) {
            this.nodeGuidesMienTrung[2].active = true;
          }
          else{
            this.nodeGuidesMienTrung[3].active = true;
          }
        }
        if (this.nodeGuideLoDeIndex == 2) {
          if (this.nodeChildBetTypeLoDeIndex == 0) {
            this.nodeGuidesMienTrung[4].active = true;
          }
          else if (this.nodeChildBetTypeLoDeIndex == 1){
            this.nodeGuidesMienTrung[5].active = true;
          }
          else{
            this.nodeGuidesMienTrung[6].active = true;
          }
        }
        if (this.nodeGuideLoDeIndex == 3) {
          if (this.nodeChildBetTypeLoDeIndex == 0) {
            this.nodeGuidesMienTrung[7].active = true;
          }
          else{
            this.nodeGuidesMienTrung[8].active = true;
          }
        }
        if (this.nodeGuideLoDeIndex == 4) {
          if (this.nodeChildBetTypeLoDeIndex == 0) {
            this.nodeGuidesMienTrung[9].active = true;
          }
          else if(this.nodeChildBetTypeLoDeIndex == 1){
            this.nodeGuidesMienTrung[10].active = true;
          }
          else{
            this.nodeGuidesMienTrung[11].active = true;
          }
        }
        
      }
    }
    else{
      for (let i = 0; i < this.nodeGuidesMienNam.length; i++) {
        this.nodeGuidesMienNam[i].active = false;
      }
  
      if (this.nodeGuideLoDeIndex > -1) {
        // if (this.nodeGuideLoDeIndex == 1 || this.nodeGuideLoDeIndex == 0) {
        //   for (let i = 0; i < this.nodeGuides.length; i++) {
        //     this.nodeGuides[i].active = i == this.nodeGuideLoDeIndex;
        //   }
        // }
        if (this.nodeGuideLoDeIndex == 0) {
          if (this.nodeChildBetTypeLoDeIndex == 0) {
            this.nodeGuidesMienNam[0].active = true;
          }
          else{
            this.nodeGuidesMienNam[1].active = true;
          }
        }
        if (this.nodeGuideLoDeIndex == 1) {
          if (this.nodeChildBetTypeLoDeIndex == 0) {
            this.nodeGuidesMienNam[2].active = true;
          }
          else if(this.nodeChildBetTypeLoDeIndex == 1){
            this.nodeGuidesMienNam[3].active = true;
          }
          else{
            this.nodeGuidesMienNam[4].active = true;
          }
        }
        if (this.nodeGuideLoDeIndex == 4) {
          if (this.nodeChildBetTypeLoDeIndex == 0) {
            this.nodeGuidesMienNam[5].active = true;
          }
          else if (this.nodeChildBetTypeLoDeIndex == 1){
            this.nodeGuidesMienNam[6].active = true;
          }
          else{
            this.nodeGuidesMienNam[7].active = true;
          }
        }
        if (this.nodeGuideLoDeIndex == 3) {
          if (this.nodeChildBetTypeLoDeIndex == 0) {
            this.nodeGuidesMienNam[8].active = true;
          }
          else{
            this.nodeGuidesMienNam[9].active = true;
          }
        }
        if (this.nodeGuideLoDeIndex == 2) {
          if (this.nodeChildBetTypeLoDeIndex == 0) {
            this.nodeGuidesMienNam[10].active = true;
          }
          else if(this.nodeChildBetTypeLoDeIndex == 1){
            this.nodeGuidesMienNam[11].active = true;
          }
          else{
            this.nodeGuidesMienNam[12].active = true;
          }
        }
        
      }
    }
    
  },

  closeGuideClicked: function (event, data) {
    this.aniGuide.play("closeGuide");
  },

  _setActiveChildBet: function (betNode, active) {
    let lbNote = betNode.getChildByName("LB Note");

    if (lbNote) {
      lbNote.active = active;
    }

    let bgON = betNode.getChildByName("bg on");
    let bgOFF = betNode.getChildByName("bg off");

    if (!bgON || !bgOFF) {
      return;
    }

    if (!active) {
      bgON.active = false;
      bgOFF.active = true;
    } else {
      bgON.active = true;
      bgOFF.active = false;
    }
  },
  openChooseCity:function(){
    //get list city by date
    this.animationMenuCity.play(this.animOpenName);
    // if (this.isOpenChooseCity == false) {
    //   this.isOpenChooseCity = true;
    //   this.animationMenuCity.play(this.animOpenName);
      
    // }   
    // else{
    //   this.isOpenChooseCity = false;
    //   this.animationMenuCity.play(this.animCloseName);
      
    // }
    
  },
  hideChooseCity:function(){
    this.animationMenuCity.play(this.animCloseName);
  },
  activeBetArea:function(index){
    this.btnTabDeactive = [];
    this.btnTabActive = [];
    this.nodeBetArea.forEach(function(area){
      area.active = false;
    });
    this.nodeBetArea[index - 1].active = true;
    this.nodeGuidesArea.forEach(function(area){
      area.active = false;
    });
    this.nodeGuidesArea[index - 1].active = true;

    //defaut
    if (index == 1) {
      this.typeBet = cc.LodeType.Lo2So;
      this.editTongCuoc.string = this.arrPayBetTypeBaoLo[0];
      this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
        this.arrWinBetTypeBaoLo[0] * 1000
      );
      this.userBet = this.arrPayBetTypeBaoLo[0] * 1000;

      for (var i = 0; i < this.nodeBetSideTabs.length; i++) {
        this.btnTabDeactive[i] =
          this.nodeBetSideTabs[i].getChildByName("deactive");
        this.btnTabActive[i] = this.nodeBetSideTabs[i].getChildByName("active");
      }

      this.onTabClicked(null, 0);
    }
    else if(index == 2){
      this.typeBet = cc.LodeType.Lo2SoMienTrung;
      this.editTongCuoc.string = this.arrPayBetTypeBaoLoMienTrung[0];
      this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
        this.arrWinBetTypeBaoLoMienTrung[0] * 1000
      );
      this.userBet = this.arrPayBetTypeBaoLoMienTrung[0] * 1000;

      for (var i = 0; i < this.nodeBetSideTabsMienTrung.length; i++) {
        this.btnTabDeactive[i] =
          this.nodeBetSideTabsMienTrung[i].getChildByName("deactive");
        this.btnTabActive[i] = this.nodeBetSideTabsMienTrung[i].getChildByName("active");
      }

      this.onTabClickedMienTrung(null, 0);
    }
    else{
      this.typeBet = cc.LodeType.Lo2SoMienNam;
      this.editTongCuoc.string = this.arrPayBetTypeBaoLoMienNam[0];
      this.lbTienThang.string = cc.Tool.getInstance().formatNumber(
        this.arrWinBetTypeBaoLoMienNam[0] * 1000
      );
      this.userBet = this.arrPayBetTypeBaoLoMienNam[0] * 1000;

      for (var i = 0; i < this.nodeBetSideTabsMienNam.length; i++) {
        this.btnTabDeactive[i] =
          this.nodeBetSideTabsMienNam[i].getChildByName("deactive");
        this.btnTabActive[i] = this.nodeBetSideTabsMienNam[i].getChildByName("active");
      }

      this.onTabClickedMienNam(null, 0);
    }
  },
  getopenDate:function(){
    let openDate = `${
      this.currentDateResult.getMonth() + 1
    }-${this.currentDateResult.getDate()}-${this.currentDateResult.getFullYear()}`;
    return openDate;
  },
  getCityID:function(){
    return this.city;
  }
});
