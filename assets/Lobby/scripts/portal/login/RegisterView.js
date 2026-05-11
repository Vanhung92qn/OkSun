/**
 * Created by Nofear on 3/14/2019.
 */

var netConfig = require('NetConfig');

(function () {
    cc.RegisterView = cc.Class({
        "extends": cc.Component,
        properties: {
            nodeRegister: cc.Node,
            editBoxUsername: cc.EditBox,
            editBoxPassword: cc.EditBox,
            editBoxRePassword: cc.EditBox,
            editBoxNickName: cc.EditBox,
            editBoxCaptcha: cc.EditBox,
            imageUrlCaptcha: cc.Sprite,
            lblpass: cc.Label,
            lblrepass: cc.Label,
        },

        // use this for initialization
        onLoad: function () {
            cc.LoginController.getInstance().setRegisterView(this);
            this.animation = this.node.getComponent(cc.Animation);
            this.node.zIndex =  cc.NoteDepth.LOGIN_VIEW;
        },

        onEnable: function () {
           // this.lbError.string = '';
            this.editBoxUsername.string = '';
            this.editBoxPassword.string = '';
            this.editBoxRePassword.string = '';
            this.editBoxNickName.string = '';
            this.editBoxCaptcha.string = '';
            this.IsLanding = false;
            this.animation.play('openPopup');
            this.showCaptcha();

        },
        showCaptcha: function() {
            this.getCaptcha();
        },
        getCaptcha: function () {
            var getCaptchaCommand = new cc.GetCaptchaCommand;
            getCaptchaCommand.execute(this);
        },
        onGetCaptchaResponse: function (response) {
            let img = new Image();
            //define img.onload before assigning src
            img.onload = function () {
                let texture = new cc.Texture2D();
                texture.initWithElement(img);
                texture.handleLoadedTexture();
                let sp = new cc.SpriteFrame(texture);
                // console.log(sp);
                //assign the spriteframe to you sprite
                this.imageUrlCaptcha.spriteFrame = sp;
            }.bind(this);
            img.src = "data:image/png;base64," + response[1];
        },
        refreshCaptchaClicked: function () {
            this.getCaptcha();
        },

        showRegister: function (enable) {
            this.nodeRegister.active = enable;
            if (enable) {
                //this.getCaptcha();
                var tool = cc.Tool.getInstance();
                if (tool.getItem('@isLanding') !== null) {
                    if (tool.getItem('@isLanding') === 'true') {
                        this.editBoxUsername.string = tool.getItem('@usernameRegis').toString();
                        this.editBoxPassword.string = tool.getItem('@passwordRegis').toString();
                        this.editBoxRePassword.string = tool.getItem('@rePasswordRegis').toString();
                        this.IsLanding = true;
                    }
                }
            }
        },

        backClicked: function () {
            this.showRegister(false);
            cc.LoginController.getInstance().showLogin(true);
        },

        

        onRegisterResponse: function (response) {
            //console.log(response);
            //se set Access Token o day -> de update duoc nick name luon
            if (response.Token) {
                cc.ServerConnector.getInstance().setToken(response.Token);
            }

            cc.LoginController.getInstance().setUserId(response.AccountInfo.AccountID);

            //cc.LoginController.getInstance().showNickname(true);

            if(response.ResponseCode == 1){
                this.nickname = this.editBoxNickName.string;
                var updateNicknameCommand = new cc.UpdateNicknameCommand;
                updateNicknameCommand.execute(this);

            }

            // cc.DDNA.getInstance().newPlayer();
        },

         //Response
        onUpdateNicknameResponse: function(response) {
            if (response.ResponseCode == 1) {
                //set token lai sau khi update NickName
                if (response.Token) {
                    // console.log('onUpdateNicknameResponse zoo: '  + response.Token);
                    cc.ServerConnector.getInstance().setToken(response.Token);
                }

                cc.LoginController.getInstance().setLoginResponse(response.AccountInfo);
                cc.LoginController.getInstance().setNextVPResponse(response.NextVIP);
                cc.LobbyController.getInstance().loginSuccess();
                cc.LobbyController.getInstance().destroyLoginView();

                
                //========
                cc.DDNA.getInstance().updateAccountName();
            }else{
                cc.PopupController.getInstance().showMessage(response.Message, response.ResponseCode);
            }
        },

        onUpdateNicknameResponseError: function(response) {
           // this.lbError.string = response.Message;
            cc.PopupController.getInstance().showMessage(response.Message);
        },
        
        selectNationEvent: function(event, data) {
            var index = cc.Config.getInstance().getIndexByNation(data.toString());

            if (this.gameAssets === undefined) {
                this.gameAssets = cc.LobbyController.getInstance().getGameAssets();
            }

            this.spriteNation.spriteFrame = this.gameAssets.sfNations[index];

            this.nationCode = data.toString();
            this.lbNation.string = '+' + data.toString();
            this.animationMenuNation.play('hideDropdownMenu');
        },

        //Click
        openMenuNationClicked: function () {
            this.animationMenuNation.play('showDropdownMenu');
        },

        hideMenuNationClicked: function () {
            this.animationMenuNation.play('hideDropdownMenu');
        },

        createAccountClicked: function () {
            //this.lbError.string = '';
            this.username = this.editBoxUsername.string;
            this.password = this.editBoxPassword.string;
            this.rePassword = this.editBoxRePassword.string;
            this.captcha = this.editBoxCaptcha.string;
            this.nickName = this.editBoxNickName.string;

            if (this.username === '') {
               // this.lbError.string = 'Vui lòng nhập tên tài khoản';
			   cc.PopupController.getInstance().showMessageErr('Vui lòng nhập tên tài khoản');
                return;
            }

            if (this.password === '') {
				cc.PopupController.getInstance().showMessageErr('Vui lòng nhập mật khẩu');
               // this.lbError.string = 'Vui lòng nhập mật khẩu';
                return;
            }

            if (this.rePassword === '') {
				cc.PopupController.getInstance().showMessageErr('Vui lòng nhập lại mật khẩu');
               // this.lbError.string = 'Nhập lại mật khẩu không khớp';
                return;
            }
			 if (this.rePassword !== this.password) {
				cc.PopupController.getInstance().showMessageErr('Nhập lại mật khẩu không chính xác');
               // this.lbError.string = 'Nhập lại mật khẩu không khớp';
                return;
            }
            if (this.nickName === '') {
                cc.PopupController.getInstance().showMessageErr('Vui lòng nhập tên hiển thị');
                return;
            }
            if (this.captcha === '') {
				cc.PopupController.getInstance().showMessageErr('Vui lòng nhập mã Captcha');
                return;
            }

            if (this.nickName.length < 6) {
                cc.PopupController.getInstance().showMessageErr('Tên hiển thị trên 6 ký tự');
                return;
            }
            if (this.nickName.length > 11) {
                cc.PopupController.getInstance().showMessageErr('Tên hiển thị dưới 12 ký tự');
                return;
            }

            var checknickname = this.onlyLettersAndNumbers(this.nickName);
            if(!checknickname){
                cc.PopupController.getInstance().showMessageErr('Tên hiển thị không được có ký tự đặc biệt');
                return;
            }
            cc.Tool.getInstance().setItem('@isLanding', false);

            var registerCommand = new cc.RegisterCommand;
            registerCommand.execute(this);
        },
        onlyLettersAndNumbers: function (str) {
          return Boolean(str.match(/^[A-Za-z0-9]*$/));
        },

        editChangeInput: function (val,target,customevent) {
            
        },

       
        editChangePassword: function (val,target,customevent) {
            if(target == 'pass'){
                this.lblpass.string = '';
            }
            if(target == 'repass'){
                this.lblrepass.string = '';
            }
        },
        editDiDBeginPassword: function (val,target,customevent) {
            if(target == 'pass'){
                this.lblpass.string = '';
            }
            if(target == 'repass'){
                this.lblrepass.string = '';
            }
        },
        editDiDEndPassword: function (val,target,customevent) {
            if(target == 'pass'){
                let str = '';
                let stringr = val._string;
                for (var i = stringr.length - 1; i >= 0; i--) {
                    str += '.';
                }
                this.lblpass.string = str;
            }
            if(target == 'repass'){
                let str = '';
                let stringr = val._string;
                for (var i = stringr.length - 1; i >= 0; i--) {
                    str += '.';
                }
                this.lblrepass.string = str;
            }
        },
        editReturnPassword: function (val,target,customevent) {
           
        },
       
    });
}).call(this);
