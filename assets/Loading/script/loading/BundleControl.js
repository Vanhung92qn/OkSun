var Global = require('Global');
var netConfig = require('NetConfig');
(function () {
    cc.BundleControl = cc.Class({
        "extends": cc.Component,
        properties: {
            is_local:false,
            serverVersion: []
        },
        onLoad: function () {
            
           // let dataTest = '{"777":{"hash":"542c1","url":"https://res.oksun.win/assets/777"},"3cay":{"hash":"2cfbe","url":"https://res.oksun.win/assets/3cay"},"adv_v2022":{"hash":"a3363","url":"https://res.oksun.win/assets/adv_v2022"},"animations":{"hash":"3108b","url":"https://res.oksun.win/assets/animations"},"ankhetravang":{"hash":"a025d","url":"https://res.oksun.win/assets/ankhetravang"},"aquarium":{"hash":"ab58d","url":"https://res.oksun.win/assets/aquarium"},"audio":{"hash":"0948b","url":"https://res.oksun.win/assets/audio"},"bacarat":{"hash":"05b3e","url":"https://res.oksun.win/assets/bacarat"},"banner":{"hash":"91da2","url":"https://res.oksun.win/assets/banner"},"baucua":{"hash":"c3a9f","url":"https://res.oksun.win/assets/baucua"},"dragonball":{"hash":"8bee6","url":"https://res.oksun.win/assets/dragonball"},"dragontiger":{"hash":"398a2","url":"https://res.oksun.win/assets/dragontiger"},"egypt":{"hash":"e0590","url":"https://res.oksun.win/assets/egypt"},"internal":{"hash":"69b9a","url":"https://res.oksun.win/assets/internal"},"khotangngulong":{"hash":"7430c","url":"https://res.oksun.win/assets/khotangngulong"},"Lobby":{"hash":"cd460","url":"https://res.oksun.win/assets/Lobby"},"lode":{"hash":"69a61","url":"https://res.oksun.win/assets/lode"},"main":{"hash":"8e5e5","url":"https://res.oksun.win/assets/main"},"maubinh":{"hash":"f54fe","url":"https://res.oksun.win/assets/maubinh"},"minipoker":{"hash":"7fae5","url":"https://res.oksun.win/assets/minipoker"},"poker":{"hash":"f6d92","url":"https://res.oksun.win/assets/poker"},"prefabs":{"hash":"0a2ed","url":"https://res.oksun.win/assets/prefabs"},"resources":{"hash":"0a004","url":"https://res.oksun.win/assets/resources"},"scenes":{"hash":"4bbe9","url":"https://res.oksun.win/assets/scenes"},"shootFish":{"hash":"002ab","url":"https://res.oksun.win/assets/shootFish"},"skeletons":{"hash":"42251","url":"https://res.oksun.win/assets/skeletons"},"sicbo":{"hash":"95337","url":"https://res.oksun.win/assets/sicbo"},"sontinhthuytinh":{"hash":"8a574","url":"https://res.oksun.win/assets/sontinhthuytinh"},"taixiu":{"hash":"5b7a0","url":"https://res.oksun.win/assets/taixiu"},"tienlenMN":{"hash":"851d5","url":"https://res.oksun.win/assets/tienlenMN"},"taixiumd5":{"hash":"01b28","url":"https://res.oksun.win/assets/taixiumd5"},"tienlenMNSoLo":{"hash":"ff07b","url":"https://res.oksun.win/assets/tienlenMNSoLo"},"tk":{"hash":"c91f8","url":"https://res.oksun.win/assets/tk"},"tq":{"hash":"dd849","url":"https://res.oksun.win/assets/tq"},"ui":{"hash":"6942a","url":"https://res.oksun.win/assets/ui"},"UiG88":{"hash":"a179d","url":"https://res.oksun.win/assets/UiG88"},"UIHIT":{"hash":"50be3","url":"https://res.oksun.win/assets/UIHIT"},"xocxoc":{"hash":"c18cd","url":"https://res.oksun.win/assets/xocxoc"}}';
            //this.serverVersion = JSON.parse(dataTest);
        },
        init: function (data) {
            //this.serverVersion = JSON.parse(data);

           //let dataTest = '{"777":{"hash":"542c1","url":"https://res.oksun.win/assets/777"},"3cay":{"hash":"2cfbe","url":"https://res.oksun.win/assets/3cay"},"adv_v2022":{"hash":"a3363","url":"https://res.oksun.win/assets/adv_v2022"},"animations":{"hash":"3108b","url":"https://res.oksun.win/assets/animations"},"ankhetravang":{"hash":"a025d","url":"https://res.oksun.win/assets/ankhetravang"},"aquarium":{"hash":"ab58d","url":"https://res.oksun.win/assets/aquarium"},"audio":{"hash":"0948b","url":"https://res.oksun.win/assets/audio"},"bacarat":{"hash":"05b3e","url":"https://res.oksun.win/assets/bacarat"},"banner":{"hash":"91da2","url":"https://res.oksun.win/assets/banner"},"baucua":{"hash":"c3a9f","url":"https://res.oksun.win/assets/baucua"},"dragonball":{"hash":"8bee6","url":"https://res.oksun.win/assets/dragonball"},"dragontiger":{"hash":"398a2","url":"https://res.oksun.win/assets/dragontiger"},"egypt":{"hash":"e0590","url":"https://res.oksun.win/assets/egypt"},"internal":{"hash":"69b9a","url":"https://res.oksun.win/assets/internal"},"khotangngulong":{"hash":"7430c","url":"https://res.oksun.win/assets/khotangngulong"},"Lobby":{"hash":"cd460","url":"https://res.oksun.win/assets/Lobby"},"lode":{"hash":"69a61","url":"https://res.oksun.win/assets/lode"},"main":{"hash":"8e5e5","url":"https://res.oksun.win/assets/main"},"maubinh":{"hash":"f54fe","url":"https://res.oksun.win/assets/maubinh"},"minipoker":{"hash":"7fae5","url":"https://res.oksun.win/assets/minipoker"},"poker":{"hash":"f6d92","url":"https://res.oksun.win/assets/poker"},"prefabs":{"hash":"0a2ed","url":"https://res.oksun.win/assets/prefabs"},"resources":{"hash":"0a004","url":"https://res.oksun.win/assets/resources"},"scenes":{"hash":"4bbe9","url":"https://res.oksun.win/assets/scenes"},"shootFish":{"hash":"002ab","url":"https://res.oksun.win/assets/shootFish"},"skeletons":{"hash":"42251","url":"https://res.oksun.win/assets/skeletons"},"sicbo":{"hash":"95337","url":"https://res.oksun.win/assets/sicbo"},"sontinhthuytinh":{"hash":"8a574","url":"https://res.oksun.win/assets/sontinhthuytinh"},"taixiu":{"hash":"5b7a0","url":"https://res.oksun.win/assets/taixiu"},"tienlenMN":{"hash":"851d5","url":"https://res.oksun.win/assets/tienlenMN"},"taixiumd5":{"hash":"01b28","url":"https://res.oksun.win/assets/taixiumd5"},"tienlenMNSoLo":{"hash":"ff07b","url":"https://res.oksun.win/assets/tienlenMNSoLo"},"tk":{"hash":"c91f8","url":"https://res.oksun.win/assets/tk"},"tq":{"hash":"dd849","url":"https://res.oksun.win/assets/tq"},"ui":{"hash":"6942a","url":"https://res.oksun.win/assets/ui"},"UiG88":{"hash":"a179d","url":"https://res.oksun.win/assets/UiG88"},"UIHIT":{"hash":"50be3","url":"https://res.oksun.win/assets/UIHIT"},"xocxoc":{"hash":"c18cd","url":"https://res.oksun.win/assets/xocxoc"}}';
           //this.serverVersion = JSON.parse(dataTest);

            
        },
        loadSceneGame: function (bundleName, sceneName, callbackProgress, bundleCallback) {
            this.loadBundle(bundleName, bundle => {
                bundle.loadScene(sceneName, function (finish, total, item) {
                    callbackProgress(finish, total);
                }, function (err1, scene) {
                    cc.director.preloadScene(sceneName, (c, t, item) => {
                        callbackProgress(c, t);
                    }, (err, sceneAsset) => {
                        cc.director.loadScene(sceneName);
                        bundleCallback();
                    });
                });
            })
        },
        loadPrefabGame: function (bundleName, prefabName, callbackProgress, bundleCallback) {
            this.loadBundle(bundleName, bundle => {
                bundle.load(prefabName, cc.Prefab, function (finish, total, item) {
                    callbackProgress(finish, total);
                }, function (err1, prefab) {
                    bundleCallback(prefab, bundle);
                });
            })
        },

        
        loadBundle: function (bundleName, bundleCallback) {
            if (this.is_local == true){
                var url = bundleName;
                cc.assetManager.loadBundle(url, (err, bundle) => {
                    if (err != null) {
                        return;
                    }
                    bundleCallback(bundle);
                });
            } else {
                var xhr = new XMLHttpRequest();
                var datares = {};
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            datares = xhr.responseText;
                        }
                    }
                };
                var link = netConfig.ASSET_CDN_URL + "AssetBundleVersion.json";
                xhr.open("GET", link, true);
                xhr.send(); 
                var delay = 0.5;
                cc.director.getScheduler().schedule(function () {
                   this.serverVersion = JSON.parse(datares);
                    var url = netConfig.ASSET_CDN_URL + bundleName;
                    var bundleVersion = this.serverVersion[bundleName];
                    cc.assetManager.loadBundle(url, { version: bundleVersion.hash }, (err, bundle) => {
                    //cc.assetManager.loadBundle(url, (err, bundle) => {
                        if (err != null) {
                             errorCallback(err);
                             cc.log("Error Donwload bundle:" + JSON.stringify(err));
                            //return;
                        }
                        bundleCallback(bundle);
                    });

                }, this, 1, 0, delay, false);

               
            }
        },
        loadPrefabPopup: function (prefabPath, cb) {
           Global.BundleLobby.load(prefabPath, (err, prefab) => {
                if (err) {
                    //  cc.log("Err load prefab bundle:", err);
                    return;
                } else {
                    //  cc.log("loadPrefabPopup Success");
                    cb(prefab);
                }
            });
        },
    });
}).call(this);