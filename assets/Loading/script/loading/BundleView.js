var Global = require('Global');
(function () {
    cc.BundleView = cc.Class({
        "extends": cc.Component,
        properties: {
            is_local:false,
        },
        onLoad: function () {
            cc.LoadingController.getInstance().setBundleView(this);
        },
        initBundle: function (data) {
            this.serverVersion = JSON.parse(data);
            this.is_local = false;
           //let dataTest = '{"adv_v2022":{"hash":"js","url":"https://res.oksun.win/assets/adv_v2022"},"animations":{"hash":"js","url":"https://res.oksun.win/assets/animations"},"audio":{"hash":"js","url":"https://res.oksun.win/assets/audio"},"banner":{"hash":"js","url":"https://res.oksun.win/assets/banner"},"fonts":{"hash":"js","url":"https://res.oksun.win/assets/fonts"},"go88":{"hash":"js","url":"https://res.oksun.win/assets/go88"},"images":{"hash":"js","url":"https://res.oksun.win/assets/images"},"images_old":{"hash":"js","url":"https://res.oksun.win/assets/images_old"},"image_nohu":{"hash":"js","url":"https://res.oksun.win/assets/image_nohu"},"internal":{"hash":"js","url":"https://res.oksun.win/assets/internal"},"Lobby":{"hash":"js","url":"https://res.oksun.win/assets/Lobby"},"main":{"hash":"js","url":"https://res.oksun.win/assets/main"},"migration":{"hash":"js","url":"https://res.oksun.win/assets/migration"},"prefabs":{"hash":"js","url":"https://res.oksun.win/assets/prefabs"},"resources":{"hash":"js","url":"https://res.oksun.win/assets/resources"},"scripts":{"hash":"js","url":"https://res.oksun.win/assets/scripts"},"skeletons":{"hash":"js","url":"https://res.oksun.win/assets/skeletons"},"sounds":{"hash":"js","url":"https://res.oksun.win/assets/sounds"},"ui":{"hash":"js","url":"https://res.oksun.win/assets/ui"},"UiG88":{"hash":"js","url":"https://res.oksun.win/assets/UiG88"},"UIHIT":{"hash":"js","url":"https://res.oksun.win/assets/UIHIT"},"game":{"hash":"js","url":"https://res.oksun.win/assets/game"}}';
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
            console.log("this.is_local");
            console.log(this.is_local);
            // if (this.is_local == true){
            //     var url = bundleName;
            //     cc.assetManager.loadBundle(url, (err, bundle) => {
            //         if (err != null) {
            //             return;
            //         }
            //         bundleCallback(bundle);
            //     });
            // } else {
            //     console.log("this.serverVersion");
            //     console.log(this.serverVersion );

            //     console.log("bundleName");
            //     console.log(bundleName);
            //     var url = "https://res.oksun.win/assets/" + bundleName;
            //     var bundleVersion = this.serverVersion[bundleName];
            //      console.log("bundleVersion");
            //     console.log(bundleVersion);
            //     //cc.assetManager.loadBundle(url, { version: bundleVersion.hash }, (err, bundle) => {
            //     cc.assetManager.loadBundle(url, (err, bundle) => {
            //         if (err != null) {
            //              errorCallback(err);
            //              cc.log("Error Donwload bundle:" + JSON.stringify(err));
            //             //return;
            //         }
            //         bundleCallback(bundle);
            //     });
            // }
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