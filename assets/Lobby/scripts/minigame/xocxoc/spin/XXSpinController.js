
(function () {
    var XXSpinController;

    XXSpinController = (function () {
        var instance;

        function XXSpinController() {
        }

        instance = void 0;

        XXSpinController.getInstance = function () {
            if (instance === void 0) {
                instance = this;
            }
            return instance.prototype;
        };

        // XXSpinController.prototype.setMPSpinView = function (mpSpinView) {
        //     return this.mpSpinView = mpSpinView;
        // };

        // XXSpinController.prototype.setMPSpinX3View = function (mpSpinX3View) {
        //     return this.mpSpinX3View = mpSpinX3View;
        // };

        XXSpinController.prototype.setXXDiceView = function (xxDiceView) {
            return this.xxDiceView = xxDiceView;
        };

        // XXSpinController.prototype.setMPPrizeView = function (mpPrizeView) {
        //     return this.mpPrizeView = mpPrizeView;
        // };

        XXSpinController.prototype.setSpinResponse = function (spinResponse) {
            // console.log("setSpinResponse");
            // console.log(spinResponse);
            this.spinResponse = spinResponse;
            return this.spinResponse = spinResponse;
        };

        XXSpinController.prototype.getSpinResponse = function () {
            return this.spinResponse;
        };

        XXSpinController.prototype.getSFDices = function () {
            // console.log("getSFDices");
            // console.log(this.xxDiceView);
            return this.xxDiceView.sfDices;
        };

        // XXSpinController.prototype.getSFPrizes = function () {
        //     return this.mpPrizeView.sfPrizes;
        // };

        XXSpinController.prototype.stopSpinFinish = function () {
            // switch (cc.MiniPokerController.getInstance().getMode()) {
            //     case cc.MiniPokerX.X1:
            //         return this.mpSpinView.stopSpinX1Finish();
            //         break;
            //     case cc.MiniPokerX.X3:
            //         return this.mpSpinX3View.stopSpinX3Finish();
            //         break;
            // }
        };

        XXSpinController.prototype.setKetQua = function (ketQua) {
            this.ketQua = ketQua;  // Lưu lại để cột nào cũng truy cập được
            // console.log("setKetQua", ketQua);
        };

        XXSpinController.prototype.getKetQua = function () {
            // nếu không có ketQua thì trả về mảng ngãu nhiên
            if (!this.ketQua) {
                const randomKetQua = [];
                for (let i = 0; i < 4; i++) {
                    randomKetQua.push(Math.floor(Math.random() * 6) + 1);
                }
                this.ketQua = randomKetQua;
            }
            return this.ketQua;
        };

        // XXSpinController.prototype.startSpinX1 = function () {
        //     return this.mpSpinView.startSpin();
        // };

        // XXSpinController.prototype.startSpinX3 = function () {
        //     return this.mpSpinX3View.startSpin();
        // };

        // XXSpinController.prototype.stopSpinX1 = function () {
        //     return this.mpSpinView.stopSpin();
        // };

        // XXSpinController.prototype.stopSpinX3 = function () {
        //     return this.mpSpinX3View.stopSpin();
        // };

        // XXSpinController.prototype.randomAllIcon = function () {
        //     switch (cc.MiniPokerController.getInstance().getMode()) {
        //         case cc.MiniPokerX.X1:
        //             this.mpSpinView.randomAllIcon();
        //             break;
        //         case cc.MiniPokerX.X3:
        //             this.mpSpinX3View.randomAllIcon();
        //             break;
        //     }
        // };

        // XXSpinController.prototype.getSpining = function () {
        //     switch (cc.MiniPokerController.getInstance().getMode()) {
        //         case cc.MiniPokerX.X1:
        //             return this.mpSpinView.isSpining;
        //             break;
        //         case cc.MiniPokerX.X3:
        //             return this.mpSpinX3View.isSpining;
        //             break;
        //     }
        // };

        // XXSpinController.prototype.autoSpin = function (isAutoSpin) {
        //     switch (cc.MiniPokerController.getInstance().getMode()) {
        //         case cc.MiniPokerX.X1:
        //             this.isAutoSpin = isAutoSpin;
        //             return this.mpSpinView.autoSpin(isAutoSpin);
        //             break;
        //         case cc.MiniPokerX.X3:
        //             this.isAutoSpin = isAutoSpin;
        //             return this.mpSpinX3View.autoSpin(isAutoSpin);
        //             break;
        //     }
        // };

        // XXSpinController.prototype.checkIsAutoSpin = function () {
        //     if (this.isAutoSpin)
        //         return this.isAutoSpin;
        //     else
        //         return false;
        // };

        return XXSpinController;

    })();

    cc.XXSpinController = XXSpinController;

}).call(this);
