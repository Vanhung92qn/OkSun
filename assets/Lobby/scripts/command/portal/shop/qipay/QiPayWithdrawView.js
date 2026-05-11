/**
 * QiPay Withdraw View - Rut tien qua QiPay aggregator.
 *
 * Flow:
 *   user chon bank tu dropdown dong (load tu QiPay /api/QiPay/BankList)
 *   + nhap STK / Ten TK / so tien
 *   -> nhan "Rut tien" -> hien confirm page -> "Xac nhan" -> goi RutTienQiPayCommand
 *
 * Cac button gan Click Events trong Cocos Editor (KHONG can keo thanh property):
 *   - btn Chon ngan hang  -> openDropdownClicked
 *   - btn Rut tien        -> clickRutTien
 *   - btn Xac nhan        -> onConfirmRut
 *   - btn Huy             -> onCancelRut
 *   - btn Lich su         -> historyClicked
 *   - editRut (Editing Changed) -> onEditingValueChanged
 *
 * Property phai keo trong Inspector:
 *   - nodeDropdown        : ScrollView root  (chi toggle .active)
 *   - nodeDropdownContent : Content node BEN TRONG ScrollView (co cc.Layout)
 *   - nodeBankItemTpl     : Template 1 item bank (AN, dat NGOAI nodeDropdownContent)
 *                           Phai co: cc.Button + cc.Label (con hoac chinh no)
 *   - lbSelectedBank      : Label hien ten bank dang chon
 *   - editNumber/editName/editRut : 3 EditBox input
 *   - ghichu, sotienview  : Label trang xac nhan
 *   - nodedangky, nodexacnhan : 2 page (form / xac nhan)
 *   - audioClick          : Audio click (optional)
 */

var helper = require('Helper');

// QiPay min/max client-side (server validate cuoi cung)
var WITHDRAW_MIN = 200000;
var WITHDRAW_MAX = 50000000;

cc.Class({
    extends: cc.Component,

    properties: {
        // ===== Bank dropdown dong =====
        nodeDropdown: cc.Node,              // ScrollView root - toggle active
        nodeDropdownContent: cc.Node,       // Content node ben trong ScrollView
        nodeBankItemTpl: cc.Node,           // Template item bank (an, ngoai content)
        lbSelectedBank: cc.Label,           // Hien ten bank dang chon

        // ===== Form input =====
        editNumber: cc.EditBox,             // STK
        editName: cc.EditBox,               // Ten TK
        editRut: cc.EditBox,                // So tien rut

        // ===== Confirm page =====
        ghichu: cc.Label,                   // "VCB STK xxx Ten TK yyy"
        sotienview: cc.Label,               // "So tien rut: xxx"
        nodedangky: cc.Node,                // Page 1: form
        nodexacnhan: cc.Node,               // Page 2: confirm

        // ===== Audio =====
        audioClick: cc.AudioSource,
        audioClickRut: cc.AudioSource,
    },

    onLoad: function () {
        this._selectedBankCode = '';
        this._selectedBankName = '';
        this._bankList = [];
        this._submitting = false;
    },

    onEnable: function () {
        if (this.nodedangky) this.nodedangky.active = true;
        if (this.nodexacnhan) this.nodexacnhan.active = false;
        if (this.nodeDropdown) this.nodeDropdown.active = false;
        this.clean();

        this._selectedBankCode = '';
        this._selectedBankName = '';
        if (this.lbSelectedBank) this.lbSelectedBank.string = 'Chọn ngân hàng';

        this._fetchQiPayBankList();
    },

    onDisable: function () {
        if (this.nodeDropdown) this.nodeDropdown.active = false;
    },

    clean: function () {
        if (this.editRut) this.editRut.string = '';
    },

    // ===== Fetch QiPay bank list + build dropdown items =====
    _fetchQiPayBankList: function () {
        if (!this.nodeDropdownContent || !this.nodeBankItemTpl) {
            cc.warn('[QiPayWithdraw] dropdown UI missing - skip fetch bank list');
            return;
        }
        var self = this;
        if (!cc.GetQiPayBankListCommand) {
            cc.error('[QiPayWithdraw] cc.GetQiPayBankListCommand UNDEFINED');
            return;
        }
        var cmd = new cc.GetQiPayBankListCommand();
        cmd.execute({
            onGetQiPayBankListResponse: function (resp) {
                var list = (resp && resp.Orders && resp.Orders.List) ? resp.Orders.List : [];
                cc.log('[QiPayWithdraw] bank list count:', list.length);
                self._bankList = list;
                self._buildDropdownItems(list);
                if (list.length > 0 && !self._selectedBankCode) {
                    self._doSelectBank(list[0]);
                }
            },
            onGetQiPayBankListError: function (resp) {
                cc.error('[QiPayWithdraw] BankList fail:', resp);
                cc.PopupController.getInstance().showMessageError('Không lấy được danh sách ngân hàng');
            }
        });
    },

    _buildDropdownItems: function (bankList) {
        var container = this.nodeDropdownContent;
        var tpl = this.nodeBankItemTpl;
        if (!container || !tpl) return;

        // Layout setup. NEN add cc.Layout truc tiep trong Cocos Editor de canh chinh
        // spacing/padding theo y muon. O day chi auto add neu CHUA co (khong override).
        var layout = container.getComponent(cc.Layout);
        if (!layout) {
            cc.warn('[QiPayWithdraw] nodeDropdownContent CHUA co cc.Layout - dang auto add (khuyen nghi add trong Editor)');
            layout = container.addComponent(cc.Layout);
            layout.type = cc.Layout.Type.VERTICAL;
            layout.resizeMode = cc.Layout.ResizeMode.CONTAINER;
            layout.verticalDirection = cc.Layout.VerticalDirection.TOP_TO_BOTTOM;
            layout.spacingY = 8;
            layout.paddingTop = 8;
            layout.paddingBottom = 8;
        }

        // Xoa item cu (giu lai template, khong destroy template)
        var toDestroy = [];
        for (var i = 0; i < container.childrenCount; i++) {
            var c = container.children[i];
            if (c !== tpl) toDestroy.push(c);
        }
        toDestroy.forEach(function (n) { n.destroy(); });
        tpl.active = false;

        // Lay item height tu template (lam fallback neu Layout khong tu space)
        var itemHeight = (tpl.height && tpl.height > 0) ? tpl.height : 60;

        for (var j = 0; j < bankList.length; j++) {
            var bank = bankList[j];
            var bankCode = bank.code || bank.bankCode || bank.BankCode || '';
            var bankName = bank.name || bank.BankName || bankCode;

            var item = cc.instantiate(tpl);
            item.active = true;
            // Bao dam item co ContentSize giong template (Layout cuoi cung se tinh lai)
            if (item.height === 0) item.height = itemHeight;
            if (item.width === 0) item.width = tpl.width || container.width || 200;

            // Set ten bank vao Label (con hoac chinh item)
            var lb = item.getComponent(cc.Label) || item.getComponentInChildren(cc.Label);
            if (lb) lb.string = bankName;

            // Wire click -> selectBankClicked, customEventData = bankCode
            var btn = item.getComponent(cc.Button);
            if (btn) {
                var handler = new cc.Component.EventHandler();
                handler.target = this.node;
                handler.component = this.__classname__ || 'QiPayWithdrawView';
                handler.handler = 'selectBankClicked';
                handler.customEventData = bankCode;
                btn.clickEvents = [handler];
                btn.interactable = true;
            } else {
                cc.warn('[QiPayWithdraw] item template KHONG co cc.Button - them Button component vao node "items"');
            }

            container.addChild(item);
        }

        // Force update layout ngay sau khi add tat ca children (khong cho frame sau).
        if (layout.updateLayout) layout.updateLayout();
        cc.log('[QiPayWithdraw] built', bankList.length, 'items, container height =', container.height,
            'classname =', this.__classname__);
    },

    _doSelectBank: function (bank) {
        if (!bank) return;
        this._selectedBankCode = bank.code || bank.bankCode || bank.BankCode || '';
        this._selectedBankName = bank.name || bank.BankName || this._selectedBankCode;
        if (this.lbSelectedBank) this.lbSelectedBank.string = this._selectedBankName;
    },

    // ===== Click Events handlers =====
    openDropdownClicked: function () {
        if (this.nodeDropdown) this.nodeDropdown.active = !this.nodeDropdown.active;
        if (this.audioClick) { this.audioClick.loop = false; this.audioClick.play(); }
    },

    // Auto-wired tu _buildDropdownItems. customEventData = bankCode
    selectBankClicked: function (_event, data) {
        cc.log('[QiPayWithdraw] selectBankClicked, data =', data);
        var bankCode = data ? data.toString() : '';
        var found = null;
        for (var i = 0; i < this._bankList.length; i++) {
            var b = this._bankList[i];
            var code = b.code || b.bankCode || b.BankCode || '';
            if (code === bankCode) { found = b; break; }
        }
        this._doSelectBank(found || { code: bankCode, name: bankCode });
        if (this.nodeDropdown) this.nodeDropdown.active = false;
        if (this.audioClick) { this.audioClick.loop = false; this.audioClick.play(); }
    },

    // ===== Format amount =====
    onEditingValueChanged: function () {
        if (!this.editRut) return;
        var text = this.editRut.string || '';
        var digits = text.replace(/[^0-9]/g, '').replace(/^0+/, '');
        var formatted = digits.length > 0 ? digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '';
        if (formatted !== text) this.editRut.string = formatted;
    },

    // ===== Click "Rut tien" =====
    // - Neu prefab co confirm page (nodedangky + nodexacnhan): hien confirm, doi user xac nhan
    // - Neu prefab CHI co 1 form (nhu UI hien tai): submit truc tiep, khong confirm
    clickRutTien: function () {
        if (!this._selectedBankCode) {
            cc.PopupController.getInstance().showMessage('Vui lòng chọn ngân hàng');
            return;
        }
        if (!this.editNumber || this.editNumber.string === '') {
            cc.PopupController.getInstance().showMessage('Vui lòng nhập số tài khoản');
            return;
        }
        if (!this.editName || this.editName.string === '') {
            cc.PopupController.getInstance().showMessage('Vui lòng nhập tên tài khoản');
            return;
        }
        if (!this.editRut || this.editRut.string === '') {
            cc.PopupController.getInstance().showMessage('Vui lòng nhập số tiền cần rút');
            return;
        }

        var amount = parseInt(helper.getOnlyNumberInString(this.editRut.string), 10) || 0;
        if (amount < WITHDRAW_MIN) {
            cc.PopupController.getInstance().showMessage('Số tiền rút tối thiểu là ' + helper.numberWithCommas(WITHDRAW_MIN) + ' đ');
            return;
        }
        if (amount > WITHDRAW_MAX) {
            cc.PopupController.getInstance().showMessage('Số tiền rút tối đa là ' + helper.numberWithCommas(WITHDRAW_MAX) + ' đ');
            return;
        }

        this.amount = amount;

        var hasConfirmPage = !!(this.nodedangky && this.nodexacnhan);
        if (hasConfirmPage) {
            // 2-page flow: render confirm page, doi user nhan "Xac nhan" -> onConfirmRut
            if (this.ghichu) {
                this.ghichu.string = this._selectedBankName + ' STK ' + this.editNumber.string + ' Tên TK ' + this.editName.string;
            }
            if (this.sotienview) {
                this.sotienview.string = 'Số tiền rút: ' + helper.numberWithCommas(this.editRut.string);
            }
            this.nodedangky.active = false;
            this.nodexacnhan.active = true;
        } else {
            // 1-page flow: submit luon
            this.onConfirmRut();
        }
    },

    // ===== Confirm rut -> goi RutTienQiPayCommand =====
    onConfirmRut: function () {
        if (this._submitting) return;
        if (!cc.RutTienQiPayCommand) {
            cc.error('[QiPayWithdraw] cc.RutTienQiPayCommand UNDEFINED');
            cc.PopupController.getInstance().showMessageError('Command rút QiPay chưa load');
            return;
        }

        this.bankCode = this._selectedBankCode;
        this.editBoxBankAccNumber = { string: this.editNumber.string };
        this.editBoxBankAccName   = { string: this.editName.string };

        this._submitting = true;
        cc.PopupController.getInstance().showBusy();
        var cmd = new cc.RutTienQiPayCommand();
        cmd.execute(this);
        if (this.audioClickRut) { this.audioClickRut.loop = false; this.audioClickRut.play(); }
    },

    onCancelRut: function () {
        if (this.nodedangky) this.nodedangky.active = true;
        if (this.nodexacnhan) this.nodexacnhan.active = false;
    },

    // ===== Callback =====
    onRutTienQiPayResponse: function (data) {
        this._submitting = false;
        cc.PopupController.getInstance().hideBusy();

        var d = data && data.Orders && data.Orders.Data;
        var msg = 'Yêu cầu rút tiền đã được gửi. Vui lòng chờ duyệt.';
        if (d && d.withdrawId) msg = 'Yêu cầu rút #' + d.withdrawId + ' đã được tạo. Đang chờ duyệt.';
        cc.PopupController.getInstance().showMessage(msg);

        // Reset form ve trang dang ky
        this.clean();
        if (this.editNumber) this.editNumber.string = '';
        if (this.editName) this.editName.string = '';
        if (this.nodedangky) this.nodedangky.active = true;
        if (this.nodexacnhan) this.nodexacnhan.active = false;

        // Refresh balance
        if (cc.BalanceController && cc.BalanceController.getInstance && d && typeof d.remainBalance !== 'undefined') {
            cc.BalanceController.getInstance().updateRealBalance(d.remainBalance);
            cc.BalanceController.getInstance().updateBalance(d.remainBalance);
        }
        if (cc.LobbyController && cc.LobbyController.getInstance && cc.LobbyController.getInstance().refreshAccountInfo) {
            cc.LobbyController.getInstance().refreshAccountInfo();
        }
    },

    onRutTienQiPayResponseError: function (data) {
        this._submitting = false;
        cc.PopupController.getInstance().hideBusy();
        var msg = (data && (data.Message || data.Description)) || 'Có lỗi xảy ra, vui lòng thử lại';
        cc.PopupController.getInstance().showMessageError(msg);
    },

    // ===== History =====
    historyClicked: function () {
        if (cc.LobbyController && cc.LobbyController.getInstance() &&
            cc.HistoryTab && typeof cc.HistoryTab.BANKOUT !== 'undefined') {
            cc.LobbyController.getInstance().createHistoryView(cc.HistoryTab.BANKOUT);
        }
        if (this.audioClick) { this.audioClick.loop = false; this.audioClick.play(); }
    },
});
