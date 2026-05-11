var netConfig = require('NetConfig');
(function () {
    cc.LoadingView = cc.Class({
        "extends": cc.Component,
        properties: {
          //  skeLogo: sp.Skeleton,

            hotUpdate: cc.HotUpdate,
            progressBar: cc.ProgressBar,
            lbProgress: cc.Label,
            lbtext: cc.Label,
            lbtextellapsed: cc.Label,
            ellapsedvalue: cc.Label,
            lbMessage: cc.Label,
            bundleControl: cc.BundleControl,
            nodeButtonTry: cc.Node,
            nodeButtonTryCheckVersion: cc.Node,
            is_local: false,
            website:"",
            livechat: "",
            version:"",
        },
        
        onLoad: function () {
            this.listSkeData = {};
            this.sceneName = 'Lobby';

            cc.debug.setDisplayStats(false);
            if (cc.sys.isNative) {
                if (cc.Device) {
                    cc.Device.setKeepScreenOn(true);
                } else if ( jsb.Device) {
                    jsb.Device.setKeepScreenOn(true);
                } else {
                    // console.log('cc.Device undefined');
                }
            } else {
                // this.getGeolocation();
            }
            if(this.is_local == true){
                this.loadLobby();
            }else{
               this.hotUpdate.init();
            }
            
            

            //this.loadLobby();
             //this.hotUpdate.init();
            //ko phai ban native -> ko init duoc -> vao game luon
            const isIOS14Device = cc.sys.os === cc.sys.OS_IOS && cc.sys.isBrowser && cc.sys.isMobile && /iPhone OS 14/.test(window.navigator.userAgent); if (isIOS14Device) { cc.MeshBuffer.prototype.checkAndSwitchBuffer = function (vertexCount) { if (this.vertexOffset + vertexCount > 65535) { this.uploadData(); this._batcher._flush(); } }; cc.MeshBuffer.prototype.forwardIndiceStartToOffset = function () { this.uploadData(); this.switchBuffer(); } }
        },
        startGame: function(){
            

           // this.bundleControl.onLoad();

            var self = this;
            var delay = 0.2;
            cc.director.getScheduler().schedule(function () {
               // console.log(datares);
                
                this.loadLobby();
            }, this, 1, 0, delay, false);
        },
        loadLobby: function() {
            var self = this;
            let time = new Date().getTime();
            this.bundleControl.loadBundle("Lobby", (bundle) => {
                let size = this.listSkeData.length;
                for (let i = 0; i < size; i++) {
                    let path = this.listSkeData[i];
                    bundle.load(path, sp.SkeletonData, (err, asset) => {
                        if (err) {
                            return;
                        }
                    });
                }
                var progress = 0;
                var version = '1.0.16';
                version = this.version;
                self.activeProgressHotUpdate(false);
                self.progressBar.progress = progress / 100;
                var str = 'Downloading version ' + version + ': ';
                self.lbtextellapsed.string = 'Time Elapsed: ';
                var start = new Date().getTime();
                self.lbtext.string = str;
                self.lbProgress.string = '0%';
                
                // bundle.loadScene(
                //     'Lobby',
                //     function (completedCount, totalCount, item) {
                //         var end = new Date().getTime();
                //         var duration = (end - start) / 1000;
                //         var bps = completedCount/duration;
                //         var time = (totalCount - completedCount) / bps;
                //         var seconds = (time % 60).toFixed(2);
                //         var tempProgress = (100 * completedCount / totalCount).toFixed(2);
                //         //dam bao cho % ko bi lui lai (do quy trinh dem asset khi load)
                //         // if (tempProgress >= progress) {
                //             progress = tempProgress;
                //         // }
                //         if(self.progressBar) {
                //             let oldProgress = parseInt(self.lbProgress.string);
                //             if(progress > oldProgress) {
                //                 self.progressBar.progress = progress / 100;
                //                 self.lbProgress.string = Math.round(progress) + '%';
                //                 self.ellapsedvalue.string = seconds;
                //                 if (Math.round(progress) == 100) {
                //                     self.lbtextellapsed.string = 'Đang xử lý file';
                //                     self.ellapsedvalue.string = '';
                //                 }
                //             }
                //         }
                //     },
                //     function(err, data){}
                // );
                // cc.director.loadScene(self.sceneName);

                bundle.loadScene('Lobby', function (finish, total, item) {

                    var tempProgress = (100 * finish / total).toFixed(2);
                    progress = tempProgress;
                    self.lbProgress.string = Math.round(progress) + '%';
                    self.progressBar.progress = (finish / total);
                }, (err1, scene) => {
                    if (err1 != null) {
                    }
                    cc.sys.localStorage.setItem("SceneLobby", scene);
                    cc.director.runScene(scene);
                    let time2 = new Date().getTime();
                });

                bundle.loadDir("PrefabPopup", cc.Prefab, (err, arrPrefab) => {
                    if (err) {
                        return;
                    }
                });
            });
        },


        loadLobby111: function() {


            var self = this;
            let time = new Date().getTime();
            this.bundleControl.loadBundle("Lobby", (bundle) => {
                let size = this.listSkeData.length;
                for (let i = 0; i < size; i++) {
                    let path = this.listSkeData[i];
                    bundle.load(path, sp.SkeletonData, (err, asset) => {
                        if (err) {
                            return;
                        }
                    });
                }
                var xhr = new XMLHttpRequest();
                //this.loadSceneGame();
                var datares = {};
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            datares = JSON.parse(xhr.responseText);
                            this.website = datares.website;
                            this.livechat = datares.livechat;
                            var progress = 0;

                            var version = '1.0.16';
                            version = datares.version;
                            self.activeProgressHotUpdate(false);
                            self.progressBar.progress = progress / 100;
                            var str = 'Downloading version ' + version + ': ';
                            self.lbtextellapsed.string = 'Time Elapsed: ';
                            var start = new Date().getTime();
                            self.lbtext.string = str;
                            self.lbProgress.string = '0%';
            
                            cc.director.preloadScene(
                            'Lobby',
                            function (completedCount, totalCount, item) {
                                var end = new Date().getTime();
                                var duration = (end - start) / 1000;
                                var bps = completedCount/duration;
                                var time = (totalCount - completedCount) / bps;
                                var seconds = (time % 60).toFixed(2);
                                

                                var tempProgress = (100 * completedCount / totalCount).toFixed(2);

                                //dam bao cho % ko bi lui lai (do quy trinh dem asset khi load)
                                // if (tempProgress >= progress) {
                                    progress = tempProgress;
                                // }
                                if(self.progressBar) {
                                    let oldProgress = parseInt(self.lbProgress.string);
                                    if(progress > oldProgress) {
                                        self.progressBar.progress = progress / 100;
                                        self.lbProgress.string = Math.round(progress) + '%';
                                        self.ellapsedvalue.string = seconds;
                                        if (Math.round(progress) == 100) {
                                            self.lbtextellapsed.string = 'Đang xử lý file';
                                            self.ellapsedvalue.string = '';
                                        }
                                    }
            
                                }
                            },
                            function(err, data){
            
                                //play animation end
            
                            }
                        );
                            cc.director.loadScene(self.sceneName);
                            bundle.loadDir("PrefabPopup", cc.Prefab, (err, arrPrefab) => {
                                if (err) {
                                    return;
                                }
                            });               }
                    }
                };
                var link = netConfig.VERSION_JSON_URL;
                xhr.open("GET", link, true);
                xhr.send(); 
                
            })

        },

        onGetConfigResponse: function(response) {
            netConfig.HOTS_U = response.host;
            // netConfig.HOST = response.api;
            //this.hotUpdate.init();
        },

        activeProgressHotUpdate: function (enable) {
            this.lbMessage.node.active = enable;
            this.nodeButtonTry.active = false;
            this.nodeButtonTryCheckVersion.active = false;

            if (enable) {
                this.lbMessage.string = 'Đang cập nhật phiên bản mới...';
            }
        },

        setProgressHotUpdate: function (progress) {
            if (progress) {
                this.progressBar.progress = progress;
                this.lbProgress.string = Math.round(progress * 100) + '%';
            } else {
                this.progressBar.progress = 0;
                this.lbProgress.string = '0%';
            }
        },
        loadAssets: function () {
             var self = this;
            var progress = 0;


            self.activeProgressHotUpdate(false);
            self.progressBar.progress = progress / 100;
            self.lbProgress.string = '0%';
            cc.director.preloadScene(
                self.sceneName,
                function (completedCount, totalCount, item) {
                    var tempProgress = (100 * completedCount / totalCount).toFixed(2);
                    //dam bao cho % ko bi lui lai (do quy trinh dem asset khi load)
                    // if (tempProgress >= progress) {
                        progress = tempProgress;
                    // }
                    if(self.progressBar) {
                        let oldProgress = parseInt(self.lbProgress.string);
                        if(progress > oldProgress) {
                            self.progressBar.progress = progress / 100;
                            self.lbProgress.string = Math.round(progress) + '%';
                        }

                    }
                },
                function(err, data){

                    //play animation end

                }
            );
            cc.director.loadScene(self.sceneName);

            // this.updateProgress(0);
            // this.lbMessage.string = "Đang tải dữ liệu...";
            
            // setTimeout(function () {
            //     this.loadSceneLocal();
            // }.bind(this), 100);
        },
        loadSceneLocal: function () {
            cc.director.preloadScene("Lobby", this.onProgress.bind(this), this.onLoaded.bind(this));
        },
        onProgress: function (completedCount, totalCount) {
            // đang tải cảnh
            var RedT = ((completedCount / totalCount) * 735) >> 0;
            var phantram = ((completedCount / totalCount) * 100) >> 0;
            this.lbMessage.string = "Đang tải dữ liệu "+phantram + "%";
            this.updateProgress(RedT);
        },
        onLoaded: function (err, asset) {
            // Tải cảnh thành công
            cc.director.loadScene("Lobby");
        },
        updateProgress: function (progress) {
            this.progressBar.width = progress;
        },
        loadSceneGame: function () {
            if(cc.sys.isBrowser) {
                let navigated = new URLSearchParams(window.location.search);
                if(navigated && navigated.get('tk')) {
                    let token = navigated.get('tk');
                    cc.ServerConnector.getInstance().setToken(token);
                    let refCode = navigated.get('refcode');
                    if(refCode === null) {
                        cc.Tool.getInstance().setItem("@refcode", "");
                    } else {
                        cc.Tool.getInstance().setItem("@refcode", refCode);
                    }
                }
            }
            var self = this;
            var progress = 0;


            self.activeProgressHotUpdate(false);
            self.progressBar.progress = progress / 100;
            self.lbProgress.string = '0%';

            cc.director.preloadScene(
                self.sceneName,
                function (completedCount, totalCount, item) {
                    var tempProgress = (100 * completedCount / totalCount).toFixed(2);
                    //dam bao cho % ko bi lui lai (do quy trinh dem asset khi load)
                    // if (tempProgress >= progress) {
                        progress = tempProgress;
                    // }
                    if(self.progressBar) {
                        let oldProgress = parseInt(self.lbProgress.string);
                        if(progress > oldProgress) {
                            self.progressBar.progress = progress / 100;
                            self.lbProgress.string = Math.round(progress) + '%';
                        }

                    }
                },
                function(err, data){

                    //play animation end

                }
            );
            cc.director.loadScene(self.sceneName);
        },

        btnweb: function () {
            cc.sys.openURL(this.website);
        },
        btnsupport: function () {
            cc.sys.openURL(this.livechat);
        },

        
    });
}).call(this);