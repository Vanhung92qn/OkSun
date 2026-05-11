/**
 * QiPay Deposit View - Nap tien qua QiPay aggregator (server tu chon master bank).
 *
 * Flow:
 *   Trang1 (form):  user nhap so tien -> nut "Tao lenh"
 *                   -> goi NapTienQiPayCommand
 *                   -> server tra master bank account + QR + content
 *   Trang2 (info):  hien thi STK / Ten TK / Noi dung CK / QR + countdown het han
 *                   -> nut "Quay lai" -> Trang1 (clear state truc tiep)
 *
 * QiPay tu dong chon ngan hang -> KHONG co dropdown chon bank trong UI.
 *
 * Persistence: payment state luu trong localStorage de restore khi popup an/hien
 *              hoac user reload trang trong khi countdown chua het.
 */

cc.Class({
    extends: cc.Component,

    properties: {
        // ===== Pages =====
        Trang1: cc.Node,                    // Form nhap so tien
        Trang2: cc.Node,                    // Hien thi thong tin nap + QR

        // ===== Trang1: bank label (read-only, hien "QIPAY TỰ ĐỘNG") =====
        lbSelectedBank: cc.Label,

        // ===== Trang1: amount input =====
        editBoxValue: cc.EditBox,

        // ===== Trang2: thong tin nap =====
        lbInfoBankAccountNumber: cc.Label,  // STK
        lbInfoBankAccountName: cc.Label,    // Ten TK
        lbChiNhanhBankDesc: cc.Label,       // Chi nhanh ("Toan Quoc")
        lbInfoBankDesc: cc.Label,           // Noi dung CK
        lbInfoAmount: cc.Label,             // So tien nap

        // ===== Countdown & QR =====
        lbCountdown: cc.Label,              // Dong ho dem nguoc HH:MM:SS
        nodeQrContainer: cc.Node,           // Node chua QR
        btnToggleQr: cc.Button,             // Giu lai vi code can show/hide + doi text con Label
        QRCODE: cc.Sprite,                  // Sprite QR

        // ===== Reset (tao lenh moi tu Trang2) =====
        nodepopupReset: cc.Node,            // Popup xac nhan reset ve Trang1

        // ===== Audio =====
        audioClick: cc.AudioSource,
        audioClickNap: cc.AudioSource,
        audioErorr: cc.AudioSource,

        // ===== CAC BUTTON DUNG CLICK EVENTS TRONG COCOS EDITOR (KHONG CAN PROPERTY) =====
        // - btnConfirm     -> topupClicked
        // - btnDoi         -> showPopupReset
        // - btnPopupAccept -> onPopupResetAccept
        // - btnPopupCancel -> onPopupResetCancel
        // - btnCopyAmount  -> copyAmountClicked
        // - btn Quay lai   -> backToTrang1
        // - btn Lich su    -> historyClicked
        // - btn Copy STK   -> copyBankAccountNumberClicked
        // - btn Copy TenTK -> copyBankAccountNameClicked
        // - btn Copy NDCK  -> copylbInfoBankDesc
        // - btnToggleQr    -> onToggleQrClicked  (van keo property vi code can active node + doi label)
    },

    onLoad: function () {
        this.currentDepositOrder = null;    // Anti-spam: giu trang thai lenh hien tai
        this.fixTime = 0;
        this.interval = null;

        // LocalStorage key gan voi user
        this.PAYMENT_STATE_KEY = 'qipay_payment_state_' + cc.LoginController.getInstance().getLoginResponse().UserID;

        // QiPay tu chon bank -> label co dinh
        if (this.lbSelectedBank) this.lbSelectedBank.string = 'QIPAY TỰ ĐỘNG';

        // An QR ban dau
        if (this.nodeQrContainer) this.nodeQrContainer.active = false;
        if (this.btnToggleQr) this.btnToggleQr.node.active = false;
        if (this.QRCODE && this.QRCODE.node) this.QRCODE.node.active = false;
        this.isQrVisible = true;

        // Min/max QiPay (server validate cuoi cung)
        this.min = 10000;
        this.max = 50000000;

        // Page state ban dau
        if (this.Trang1) this.Trang1.active = true;
        if (this.Trang2) this.Trang2.active = false;
        if (this.nodepopupReset) this.nodepopupReset.active = false;

        this.checkAndRestorePaymentState();
    },

    onEnable: function () {
        // Restore tu localStorage truoc neu memory chua co
        if (!this.currentDepositOrder) {
            var savedState = this.loadPaymentState();
            if (savedState && savedState.status === 'CREATED') {
                this.checkPaymentStatusFromServer(savedState);
                return;
            }
        }

        // Anti-spam: chua co lenh -> Trang1, da co lenh -> Trang2
        if (!this.currentDepositOrder) {
            this.resetInput();
            if (this.Trang1) this.Trang1.active = true;
            if (this.Trang2) this.Trang2.active = false;
        } else {
            this.renderTrang2WithState(this.currentDepositOrder);
        }

        // Throttle confirm 3s/lan (chi check flag, khong disable button)
        this.isTimerConfirm = false;
        this.timerConfirm = 0;
        this.timePerConfirm = 3;
    },

    onDisable: function () {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    },

    onDestroy: function () {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.fixTime = 0;
        this.currentDepositOrder = null;
    },

    update: function (dt) {
        if (this.isTimerConfirm) {
            this.timerConfirm -= dt;
            if (this.timerConfirm <= 0) {
                this.isTimerConfirm = false;
                this.timerConfirm = 0;
            }
        }
    },

    // ===== Throttle confirm =====
    activeTimeConfirm: function () {
        this.isTimerConfirm = true;
        this.timerConfirm = this.timePerConfirm;
    },

    resetInput: function () {
        if (this.editBoxValue) this.editBoxValue.string = '';
    },

    // ===== Copy clipboard =====
    // Helper: copy text vao clipboard, fallback nhieu cach
    // (cc.Tool.copyToClipboard co the return false tren browser).
    _copyText: function (text, successMsg) {
        cc.log('[QiPay] _copyText:', text);
        if (text === undefined || text === null || text === '') {
            cc.warn('[QiPay] _copyText empty text');
            return;
        }
        text = String(text);
        var ok = false;

        // 1. Thu cc.Tool truoc
        try {
            if (cc.Tool && cc.Tool.getInstance && cc.Tool.getInstance().copyToClipboard) {
                ok = cc.Tool.getInstance().copyToClipboard(text);
                cc.log('[QiPay] cc.Tool.copyToClipboard ->', ok);
            }
        } catch (e) { cc.warn('[QiPay] cc.Tool fail:', e); }

        // 2. Fallback: navigator.clipboard (modern browser, can HTTPS)
        if (!ok && typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
            try {
                navigator.clipboard.writeText(text);
                ok = true;
                cc.log('[QiPay] navigator.clipboard OK');
            } catch (e) { cc.warn('[QiPay] navigator.clipboard fail:', e); }
        }

        // 3. Fallback: document.execCommand('copy') voi textarea tam
        if (!ok && typeof document !== 'undefined' && document.execCommand) {
            try {
                var ta = document.createElement('textarea');
                ta.value = text;
                ta.style.position = 'fixed';
                ta.style.left = '-9999px';
                ta.style.top = '0';
                document.body.appendChild(ta);
                ta.focus();
                ta.select();
                ok = document.execCommand('copy');
                document.body.removeChild(ta);
                cc.log('[QiPay] execCommand copy ->', ok);
            } catch (e) { cc.warn('[QiPay] execCommand fail:', e); }
        }

        if (ok) {
            if (successMsg) cc.PopupController.getInstance().showMessage(successMsg);
            if (this.audioClick) { this.audioClick.loop = false; this.audioClick.play(); }
        } else {
            cc.PopupController.getInstance().showMessage('Trình duyệt không cho phép copy. Vui lòng copy thủ công.');
        }
    },

    copyBankAccountNumberClicked: function () {
        cc.log('[QiPay] copyBankAccountNumberClicked, lbInfoBankAccountNumber =', !!this.lbInfoBankAccountNumber);
        if (!this.lbInfoBankAccountNumber) return;
        this._copyText(this.lbInfoBankAccountNumber.string, 'Đã sao chép số tài khoản.');
    },
    copyBankAccountNameClicked: function () {
        cc.log('[QiPay] copyBankAccountNameClicked');
        if (!this.lbInfoBankAccountName) return;
        this._copyText(this.lbInfoBankAccountName.string, 'Đã sao chép tên tài khoản.');
    },
    copylbInfoBankDesc: function () {
        cc.log('[QiPay] copylbInfoBankDesc');
        if (!this.lbInfoBankDesc) return;
        this._copyText(this.lbInfoBankDesc.string, 'Đã sao chép nội dung chuyển khoản.');
    },
    copyAmountClicked: function () {
        cc.log('[QiPay] copyAmountClicked, amount =', this.amount);
        var amountToCopy = this.amount;
        if (!amountToCopy) return;
        this._copyText(amountToCopy, 'Đã sao chép số tiền: ' + cc.Tool.getInstance().formatNumber(amountToCopy) + ' đ');
    },

    // ===== Format amount input =====
    onEditingValueChanged: function () {
        var val = cc.Tool.getInstance().removeDot(this.editBoxValue.string);
        this.editBoxValue.string = cc.Tool.getInstance().formatNumberkvn1102(val);
    },
    onEditingValueDidEnd: function () {
        this.onEditingValueChanged();
    },

    // ===== History =====
    historyClicked: function () {
        cc.LobbyController.getInstance().createHistoryView(cc.HistoryTab.BANK);
        if (this.audioClick) { this.audioClick.loop = false; this.audioClick.play(); }
    },

    // ===== Click "Tao lenh nap" =====
    topupClicked: function () {
        cc.log('[QiPay] topupClicked: entered');

        // Anti-spam: chan double-click trong 3s
        if (this.isTimerConfirm) {
            cc.log('[QiPay] throttled, please wait', this.timerConfirm.toFixed(1), 's');
            return;
        }

        cc.log('[QiPay] editBoxValue.string =', this.editBoxValue && this.editBoxValue.string);

        this.amount = cc.Tool.getInstance().removeDot(this.editBoxValue.string);
        cc.log('[QiPay] amount after removeDot =', this.amount);

        if (this.editBoxValue.string === '' || this.amount === '' || this.amount === 0) {
            cc.warn('[QiPay] validation FAIL: empty amount');
            cc.PopupController.getInstance().showMessage('Vui lòng nhập số tiền muốn nạp.');
            if (this.audioErorr) { this.audioErorr.loop = false; this.audioErorr.play(); }
            return;
        }

        this.amount = parseInt(this.amount) || 0;
        cc.log('[QiPay] amount parsed =', this.amount, 'min =', this.min, 'max =', this.max);

        if (this.max && this.amount > this.max) {
            cc.warn('[QiPay] validation FAIL: > max');
            cc.PopupController.getInstance().showMessage('Số tiền nạp tối đa là ' + cc.Tool.getInstance().formatNumber(this.max) + ' đ');
            if (this.audioErorr) { this.audioErorr.loop = false; this.audioErorr.play(); }
            return;
        }
        if (this.min && this.amount < this.min) {
            cc.warn('[QiPay] validation FAIL: < min');
            cc.PopupController.getInstance().showMessage('Số tiền nạp tối thiểu là ' + cc.Tool.getInstance().formatNumber(this.min) + ' đ');
            if (this.audioErorr) { this.audioErorr.loop = false; this.audioErorr.play(); }
            return;
        }

        this.VarAmount = this.amount;
        cc.log('[QiPay] VarAmount =', this.VarAmount, '-> calling NapTienQiPayCommand');

        if (!cc.NapTienQiPayCommand) {
            cc.error('[QiPay] cc.NapTienQiPayCommand UNDEFINED! Command file chua duoc load.');
            cc.PopupController.getInstance().showMessageError('Command QiPay chưa được load.');
            return;
        }

        cc.PopupController.getInstance().showBusy();
        try {
            var cmd = new cc.NapTienQiPayCommand();
            cmd.execute(this);
            cc.log('[QiPay] command executed, waiting for response...');
        } catch (e) {
            cc.PopupController.getInstance().hideBusy();
            cc.error('[QiPay] cmd.execute throw:', e);
            cc.PopupController.getInstance().showMessageError('Lỗi gọi API: ' + e.message);
            return;
        }
        this.activeTimeConfirm();
        if (this.audioClickNap) { this.audioClickNap.loop = false; this.audioClickNap.play(); }
    },

    // ===== Callback nap QiPay =====
    onNapTienQiPayResponse: function (data) {
        try {
            cc.log('[QiPay] onNapTienQiPayResponse: data =', JSON.stringify(data));

            if (!data || data.ResponseCode !== 1) {
                cc.warn('[QiPay] response NOT ok, ResponseCode =', data && data.ResponseCode);
                cc.PopupController.getInstance().showMessageError((data && data.Message) ? data.Message : 'Không nhận được phản hồi từ server');
                return;
            }
            if (!data.Orders || !data.Orders.Data) {
                cc.warn('[QiPay] response thieu Orders.Data');
                cc.PopupController.getInstance().showMessageError('Không nhận được thông tin nạp từ server');
                return;
            }

            cc.log('[QiPay] step 1: parse data');
            var d = data.Orders.Data;
            var orders = {
                Amount: d.amount,
                Content: d.chargeCode,
                QRData: d.qrUrl,
                RequestID: d.requestId,
                DepositID: d.depositId,
                TimeToExpired: d.timeToExpired || 900
            };
            var banks = {
                BankName: d.bankProvider || 'QiPay',
                MasterBankAccount: d.bankAccount || '',
                MasterBankName: d.bankAccountName || ''
            };

            cc.log('[QiPay] step 2: validate bank/qr - bankAcc =', banks.MasterBankAccount, 'qr =', orders.QRData);
            if (!banks.MasterBankAccount || !banks.MasterBankName) {
                cc.PopupController.getInstance().showMessageError('Thông tin ngân hàng không đầy đủ');
                return;
            }
            if (!orders.QRData) {
                cc.PopupController.getInstance().showMessageError('Không nhận được mã QR từ QiPay. Vui lòng thử lại.');
                return;
            }

            cc.log('[QiPay] step 3: btnToggleQr =', !!this.btnToggleQr);
            if (this.btnToggleQr && this.btnToggleQr.node) this.btnToggleQr.node.active = true;
            this.isQrVisible = true;
            this.updateToggleQrButtonText();

            cc.log('[QiPay] step 4: clearQRCode');
            this.clearQRCode();

            cc.log('[QiPay] step 5: render labels');
            if (this.lbInfoBankAccountNumber) this.lbInfoBankAccountNumber.string = banks.MasterBankAccount;
            if (this.lbInfoBankAccountName)   this.lbInfoBankAccountName.string   = banks.MasterBankName;
            if (this.lbInfoBankDesc)          this.lbInfoBankDesc.string          = orders.Content || '';
            if (this.lbChiNhanhBankDesc)      this.lbChiNhanhBankDesc.string      = 'Toàn Quốc';
            if (this.lbInfoAmount && this.lbInfoAmount.node) {
                this.lbInfoAmount.node.active = true;
                this.lbInfoAmount.string = cc.Tool.getInstance().formatNumber(orders.Amount) + ' đ';
            }

            cc.log('[QiPay] step 6: switch to Trang2 BEFORE QR load');
            this.currentDepositOrder = {
                orders: orders,
                banks: banks,
                qrData: orders.QRData,
                timestamp: Date.now(),
                requestId: orders.RequestID || null,
                status: 'CREATED'
            };
            this.fixTime = orders.TimeToExpired || 900;
            this.startCountdown();
            this.savePaymentState();

            if (this.Trang1) this.Trang1.active = false;
            if (this.Trang2) this.Trang2.active = true;
            cc.log('[QiPay] step 7: Trang2 active');

            cc.PopupController.getInstance().showMessage('Đã tạo yêu cầu nạp tiền thành công!');

            // Render QR sau cung (async, khong chan flow)
            cc.log('[QiPay] step 8: load QR url =', orders.QRData);
            this.loadQrAsync(orders.QRData);
        } catch (err) {
            cc.error('[QiPay] onNapTienQiPayResponse THROW:', err && err.stack ? err.stack : err);
            cc.PopupController.getInstance().showMessageError('Lỗi xử lý phản hồi: ' + (err && err.message ? err.message : err));
        }
    },

    loadQrAsync: function (qrData) {
        var self = this;
        if (!qrData) return;

        if (qrData.indexOf('data:image') === 0 || qrData.indexOf('http') === 0 || qrData.indexOf('https') === 0) {
            cc.log('[QiPay] QR is image URL, loading...');
            cc.loader.load({ url: qrData, type: 'png' }, function (err, tex) {
                if (err) {
                    cc.error('[QiPay] cc.loader.load fail:', err);
                    return;
                }
                cc.log('[QiPay] QR loaded, displaying');
                self.displayQRCode(tex);
            });
        } else if (qrData.length > 20 && qrData.indexOf('0002010102') === 0) {
            var primary = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' + encodeURIComponent(qrData);
            cc.loader.load({ url: primary, type: 'png' }, function (err, tex) {
                if (err) {
                    var fallback = 'https://quickchart.io/qr?text=' + encodeURIComponent(qrData) + '&size=300';
                    cc.loader.load({ url: fallback, type: 'png' }, function (err2, tex2) {
                        if (err2) { cc.error('[QiPay] QR fallback fail:', err2); return; }
                        self.displayQRCode(tex2);
                    });
                    return;
                }
                self.displayQRCode(tex);
            });
        } else {
            cc.error('[QiPay] QR data format khong hop le:', qrData.substring(0, 50));
        }
    },

    onNapTienQiPayResponseError: function (data) {
        cc.log('[QiPay] onNapTienQiPayResponseError: data =', JSON.stringify(data));
        cc.PopupController.getInstance().hideBusy();
        cc.PopupController.getInstance().showMessageError((data && data.Message) ? data.Message : 'Có lỗi xảy ra, vui lòng thử lại');
    },

    // ===== Countdown =====
    startCountdown: function () {
        if (this.interval) clearInterval(this.interval);
        var self = this;
        this.updateTimeCount();
        this.interval = setInterval(function () { self.updateTimeCount(); }, 1000);
    },
    updateTimeCount: function () {
        if (!this.fixTime) {
            if (this.interval) { clearInterval(this.interval); this.interval = null; }
            if (this.lbCountdown) this.lbCountdown.string = '⏰ HẾT THỜI GIAN';
            this.markPaymentAsFailed();
            this.autoResetToTrang1();
            return;
        }
        this.fixTime--;
        if (this.fixTime <= 0) { this.fixTime = 0; this.updateTimeCount(); return; }

        var msec = this.fixTime * 1000;
        var hh = Math.floor(msec / 3600000);  msec -= hh * 3600000;
        var mm = Math.floor(msec / 60000);    msec -= mm * 60000;
        var ss = Math.floor(msec / 1000);
        hh = hh < 10 ? '0' + hh : hh;
        mm = mm < 10 ? '0' + mm : mm;
        ss = ss < 10 ? '0' + ss : ss;
        if (this.lbCountdown) this.lbCountdown.string = '⏱️ ' + hh + ':' + mm + ':' + ss;

        if (this.fixTime % 10 === 0) this.savePaymentState();
    },

    // ===== QR =====
    clearQRCode: function () {
        if (this.QRCODE && this.QRCODE.node) {
            this.QRCODE.node.removeAllChildren();
            this.QRCODE.node.active = false;
        }
        if (this.nodeQrContainer) this.nodeQrContainer.active = false;
        if (this.btnToggleQr) this.btnToggleQr.node.active = false;
        this.isQrVisible = true;
    },
    displayQRCode: function (tex) {
        if (!this.QRCODE || !this.QRCODE.node || !tex) {
            cc.error('[QiPay] displayQRCode: QRCODE node or texture missing');
            return;
        }

        // Tao node con QRSprite + Sprite component (style giong CodePayView).
        // Dung string 'cc.Sprite' thay vi class ref de tranh "Type must be non-nil"
        // khi class ref undefined trong runtime callback context.
        try {
            var qrSpriteNode = new cc.Node('QRSprite');
            var qrSprite = qrSpriteNode.addComponent('cc.Sprite');
            qrSprite.spriteFrame = new cc.SpriteFrame(tex);

            var targetSize = 200;
            var origSize = qrSprite.spriteFrame.getOriginalSize();
            var scale = targetSize / Math.max(origSize.width, origSize.height);
            qrSpriteNode.setScale(scale);
            qrSpriteNode.setPosition(0, 0);

            this.QRCODE.node.addChild(qrSpriteNode);
            qrSpriteNode.zIndex = 0;
            this.QRCODE.node.active = true;
        } catch (e) {
            cc.error('[QiPay] displayQRCode error:', e);
            return;
        }

        if (this.nodeQrContainer) this.nodeQrContainer.active = true;
        this.isQrVisible = true;
        this.updateToggleQrButtonText();
    },

    // ===== Back Trang1 (truc tiep, khong popup confirm) =====
    backToTrang1: function () {
        if (this.Trang1) this.Trang1.active = true;
        if (this.Trang2) this.Trang2.active = false;
        if (this.nodepopupReset) this.nodepopupReset.active = false;

        this.currentDepositOrder = null;
        this.clearQRCode();
        this.resetInput();
        if (this.interval) { clearInterval(this.interval); this.interval = null; }
        this.fixTime = 0;
        this.clearPaymentState();
    },

    // ===== Reset flow (tao lenh moi tu Trang2) =====
    // Click btnDoi -> show popup confirm
    showPopupReset: function () {
        cc.log('[QiPay] showPopupReset entered, nodepopupReset =', !!this.nodepopupReset);
        if (this.audioClick) { this.audioClick.loop = false; this.audioClick.play(); }
        if (!this.nodepopupReset) {
            cc.error('[QiPay] nodepopupReset NULL - chua keo node vao property "Nodepopup Reset" cua component');
            return;
        }
        this.nodepopupReset.active = true;
        // Bring to front: dam bao popup khong bi node khac che
        this.nodepopupReset.zIndex = 9999;
        cc.log('[QiPay] nodepopupReset.active =', this.nodepopupReset.active, 'zIndex =', this.nodepopupReset.zIndex);
    },
    // Click btnPopupAccept -> quay ve Trang1 + clear state
    onPopupResetAccept: function () {
        cc.log('[QiPay] onPopupResetAccept entered');
        if (this.audioClick) { this.audioClick.loop = false; this.audioClick.play(); }
        this.backToTrang1();
    },
    // Click btnPopupCancel -> tat popup, giu Trang2 hien tai
    onPopupResetCancel: function () {
        cc.log('[QiPay] onPopupResetCancel entered');
        if (this.audioClick) { this.audioClick.loop = false; this.audioClick.play(); }
        if (this.nodepopupReset) this.nodepopupReset.active = false;
    },

    // ===== Toggle QR =====
    onToggleQrClicked: function () {
        if (this.audioClick) { this.audioClick.loop = false; this.audioClick.play(); }
        this.isQrVisible = !this.isQrVisible;
        if (this.nodeQrContainer) this.nodeQrContainer.active = this.isQrVisible;
        this.updateToggleQrButtonText();
    },
    updateToggleQrButtonText: function () {
        if (!this.btnToggleQr || !this.btnToggleQr.node) return;
        var text = this.isQrVisible ? 'Ẩn QR Code' : 'Hiện QR Code';
        // Dung string 'cc.Label' tranh "Type must be non-nil" neu class ref undefined.
        var label = this.btnToggleQr.node.getChildByName('Label');
        if (label) {
            var lc = label.getComponent('cc.Label');
            if (lc) lc.string = text;
            return;
        }
        for (var i = 0; i < this.btnToggleQr.node.children.length; i++) {
            var lc2 = this.btnToggleQr.node.children[i].getComponent('cc.Label');
            if (lc2) { lc2.string = text; return; }
        }
    },

    // ===== Payment state in localStorage =====
    savePaymentState: function () {
        if (!this.currentDepositOrder) return;
        var state = {
            orders: this.currentDepositOrder.orders,
            banks: this.currentDepositOrder.banks,
            qrData: this.currentDepositOrder.qrData,
            timestamp: this.currentDepositOrder.timestamp,
            requestId: this.currentDepositOrder.requestId,
            status: this.currentDepositOrder.status,
            fixTime: this.fixTime,
            expiryTime: Date.now() + (this.fixTime * 1000)
        };
        try { cc.sys.localStorage.setItem(this.PAYMENT_STATE_KEY, JSON.stringify(state)); }
        catch (e) { cc.error('[QiPay] Save state fail:', e); }
    },
    loadPaymentState: function () {
        try {
            var s = cc.sys.localStorage.getItem(this.PAYMENT_STATE_KEY);
            if (!s) return null;
            var state = JSON.parse(s);
            if (state.expiryTime && Date.now() > state.expiryTime) {
                this.clearPaymentState();
                return null;
            }
            if (state.expiryTime) {
                state.fixTime = Math.max(0, Math.floor((state.expiryTime - Date.now()) / 1000));
            }
            return state;
        } catch (e) { return null; }
    },
    clearPaymentState: function () {
        try { cc.sys.localStorage.removeItem(this.PAYMENT_STATE_KEY); }
        catch (e) { /* ignore */ }
    },
    checkAndRestorePaymentState: function () {
        // Khong restore o onLoad - de onEnable xu ly de render UI dung thoi diem
        var savedState = this.loadPaymentState();
        if (!savedState || savedState.status !== 'CREATED') return;
    },
    checkPaymentStatusFromServer: function (savedState) {
        // TODO: goi API check status thuc te tu server
        // Tam thoi restore tu localStorage
        this.currentDepositOrder = {
            orders: savedState.orders,
            banks: savedState.banks,
            qrData: savedState.qrData,
            timestamp: savedState.timestamp,
            requestId: savedState.requestId,
            status: savedState.status
        };
        this.fixTime = savedState.fixTime || 0;
        if (this.fixTime > 0) {
            this.renderTrang2WithState(this.currentDepositOrder);
        } else {
            this.autoResetToTrang1();
        }
    },

    renderTrang2WithState: function (orderState) {
        if (this.Trang1) this.Trang1.active = false;
        if (this.Trang2) this.Trang2.active = true;

        var orders = orderState.orders;
        var banks = orderState.banks;
        if (orders && banks) {
            if (this.lbInfoBankAccountNumber) this.lbInfoBankAccountNumber.string = banks.MasterBankAccount || '';
            if (this.lbInfoBankAccountName)   this.lbInfoBankAccountName.string   = banks.MasterBankName || '';
            if (this.lbInfoBankDesc)          this.lbInfoBankDesc.string          = orders.Content || '';
            if (this.lbChiNhanhBankDesc)      this.lbChiNhanhBankDesc.string      = 'Toàn Quốc';
            if (this.lbInfoAmount) {
                this.lbInfoAmount.node.active = true;
                this.lbInfoAmount.string = cc.Tool.getInstance().formatNumber(orders.Amount) + ' đ';
            }
            if (orderState.qrData) this.restoreQRCode(orderState.qrData);
        }
        if (this.fixTime > 0 && !this.interval) this.startCountdown();
    },

    restoreQRCode: function (qrData) {
        if (this.btnToggleQr && this.btnToggleQr.node) this.btnToggleQr.node.active = true;
        this.isQrVisible = true;
        this.updateToggleQrButtonText();
        this.loadQrAsync(qrData);
    },

    autoResetToTrang1: function () {
        this.currentDepositOrder = null;
        this.clearQRCode();
        this.resetInput();
        if (this.interval) { clearInterval(this.interval); this.interval = null; }
        this.fixTime = 0;
        this.clearPaymentState();
        if (this.Trang1) this.Trang1.active = true;
        if (this.Trang2) this.Trang2.active = false;
        cc.PopupController.getInstance().showMessage('Lệnh nạp tiền đã hết hạn. Vui lòng tạo lệnh mới.');
    },

    markPaymentAsFailed: function () {
        if (!this.currentDepositOrder || !this.currentDepositOrder.requestId) return;
        // TODO: POST /api/QiPay/MarkPaymentFailed { RequestID: ... }
        if (this.currentDepositOrder) this.currentDepositOrder.status = 'FAILED';
    },
});
