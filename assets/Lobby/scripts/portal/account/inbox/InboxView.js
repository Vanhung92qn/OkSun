/**
 * Created by Nofear on 3/15/2019.
 */
//var InboxListData = require('InboxListData');

(function () {
    cc.InboxView = cc.Class({
        "extends": cc.Component,
        properties: {
            inboxTemp: cc.Node,
            inboxParent: cc.Node,

            lbInfo: cc.Label,

            tabs: [cc.Node],
            tabName: [cc.Label],

            lblTitle: cc.Label,
            lblDesc: cc.Label,
            nodebtntab: [cc.Button],
            nodetab: [cc.Node],
            btnBack: cc.Node,
            tabContentMain: cc.Node,
            nodeDetail: cc.Node,
            lbContent: cc.Label,
        },

        onLoad: function () {
            cc.InboxController.getInstance().setInboxView(this);
			this.node.zIndex =  cc.NoteDepth.POPUP_PORTAL;
            this.getInbox(1);
			this.animation = this.node.getComponent(cc.Animation);
            this.index = 0;
        },
		onEnable: function () {
          this.animation.play('openPopup');
        },

        getInbox: function (index) {
            // var children = this.inboxParent.children;
            // for (var i = children.length - 1; i >= 0; i--) {
            //     this.inboxParent.removeChild(children[i]);
            // }
             this.inboxItems = [];

            // switch (Number.parseInt(index)) {
            //     case 0:
            //         this.inboxSetContent(index==0? 'Hộp thư cá nhân rỗng!' : '', '');
            //         break;
            //     case 1:
            //         var userMailCommand = new cc.UserMailCommand;
            //         userMailCommand.execute(this);
            //         break;
            // }

            var userMailCommand = new cc.UserMailCommand;
            userMailCommand.execute(this);
        },

        inboxUnselect: function() {
            var children = this.inboxParent.children;
            for (var i = children.length - 1; i >= 0; i--) {
                children[i].getComponent('InboxItem').closeClicked();
            }
        },

        inboxSetContent: function(title, desc) {
            this.lblTitle.string = title;
            this.lblDesc.string = desc;
        },

        onUserMailResponse: function (response) {
            // cc.log('ib ==> ' + JSON.stringify(response));
            this.list = response.List;
            //list = InboxListData; //test
            // this.tabInboxCount(0, 0);
            // this.tabInboxCount(1, list.length);

            // add default msg
            // var item = {
            //     Title: "Chào mừng quý khách",
            //     CreatedTime: new Date(),
            //     Status: '1',
            //     Content: 'Chào mừng quý khách đến với cổng giải trí trực tuyến Hot nhất hiện nay.\nQuý khách có thể trải nghiệm hàng loạt trò chơi vô cùng hấp dẫn, đăng ký dễ dàng, giao dịch nhanh chóng qua nhiều cổng giao dịch rất tiện lợi.\nTỷ lệ quy đổi 1-1 không mất phí.\nHệ thống nạp tiền đa dạng qua ngân hàng, momo và thẻ cào.\nHỗ trợ khách hàng 24/7 tất cả các ngày. Chúc quý khách luôn vui vẻ và gặp nhiều may mắn.',
            // }
            // var nodeInbox = cc.instantiate(this.inboxTemp);
            // nodeInbox.parent = this.inboxParent;
            // var inboxItem = nodeInbox.getComponent(cc.InboxItem);
            // inboxItem.initItem(item, this);
            // this.inboxItems.push(inboxItem);
            // inboxItem.openClicked();

            if (this.list !== null && this.list.length > 0) {
                this.lbInfo.string = '';

                var self = this;
                this.list.forEach(function (item) {
                    var nodeInbox = cc.instantiate(self.inboxTemp);
                    nodeInbox.parent = self.inboxParent;
                    var inboxItem = nodeInbox.getComponent(cc.InboxItem);
                    inboxItem.initItem(item, self);
                    self.inboxItems.push(inboxItem);
                });
            } else {
                //this.lbInfo.string = 'Không có thông báo nào';
            }
        },

        onSystemMailResponseError: function (response) {
            this.lbInfo.string = 'Không có thông báo nào';
        },

        tabSelect: function(data, index) {
            // for (var i = 0; i < this.tabs.length; i++) {
            //     this.tabs[i].active = false;
            // }

            // this.tabs[index].active = true;
            // this.getInbox(index);
            this.index = index;
            for (var i = 0; i < this.nodetab.length; i++) {
                this.nodebtntab[i].node.getChildByName("on").getComponent(cc.Sprite).node.active = false;
                this.nodetab[i].active = false;
            }
            this.nodebtntab[index].node.getChildByName("on").getComponent(cc.Sprite).node.active = true;
            this.nodetab[index].active = true;

        },

        backinbox: function() {
           
        },
        tabInboxCount: function(index, amount) {
            this.tabName[index].string = (index==0? 'Tin Nóng' : 'Hòm thư');
        },

         openClicked: function (data,target) {

            var inbox_id = data.currentTarget.customEventData;
            for (var i = 0; i < this.list.length; i++) {
                if(this.list[i].ID == inbox_id){
                    this.lbContent.string = this.list[i].Content;
                }
            }
            this.tabContentMain.active = false;
            this.nodeDetail.active = true;
            this.btnBack.active = true;
            for (var i = 0; i < this.nodetab.length; i++) {
                this.nodebtntab[i].node.active = false;
                this.nodetab[i].active = false;
            }
            // this.parent.inboxUnselect();
            // this.parent.inboxSetContent(this.lbTitle.string, this.lbContent.string);

            // this.nodeOpen.active = false;
            // //this.nodeClose.active = true;
            // //this.nodeDetail.active = true;
            // //this.sprite.enabled = false;
            // this.nodeSelect.active = true;

            // //Tim xem co giftcode ko?
            // if (this.giftcode !== '') {
            //     this.nodeGiftCode.active = true;
            // } else {
            //     this.nodeGiftCode.active = false;
            // }

            // if (this.item.Status.toString() === cc.MailStatus.UNREAD) {
            //     var updateStatusMailCommand = new cc.UpdateStatusMailCommand;
            //     updateStatusMailCommand.execute(this, parseInt(cc.MailStatus.READ));
            // }
        },


    //    closeClicked: function () {
	//		this.animation.play('closePopup');
    //        //this.nodeOpen.active = true;
    //        //this.nodeClose.active = false;
    //        //this.nodeDetail.active = false;
    //        //this.nodeGiftCode.active = false;
    //        //this.sprite.enabled = true;
    //       // this.nodeSelect.active = false;
    //        this.tabContentMain.active = true;
    //        this.nodeDetail.active = false;
    //        this.btnBack.active = false;
    //        this.lbContent.string = '';
    //        for (var i = 0; i < this.nodetab.length; i++) {
    //            this.nodebtntab[i].node.active = true;
    //            this.nodetab[i].active = false;
    //        }
    //        this.nodetab[this.index].active = true;
    //    },


        closeClicked: function () {
			this.tabContentMain.active = true;
            this.nodeDetail.active = false;
            this.btnBack.active = false;
            this.lbContent.string = '';
			for (var i = 0; i < this.nodetab.length; i++) {
                this.nodebtntab[i].node.active = true;
                this.nodetab[i].active = false;
            }
            this.nodetab[this.index].active = true;
            //this.showRegister(false);
            this.animation.play('closePopup');
            var self = this;
            var delay = 0.12;
            cc.director.getScheduler().schedule(function () {
                self.animation.stop();
                cc.LobbyController.getInstance().destroyInboxView();
            }, this, 1, 0, delay, false);
        }

    });
}).call(this);
