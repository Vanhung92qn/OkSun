/**
 * Created by Nofear on 6/21/2017.
 */

(function () {
    var LoadingController;

    LoadingController = (function () {
        var instance;
        var serverVersion;
        function LoadingController() {

        }

        instance = void 0;

        LoadingController.getInstance = function () {
            if (instance === void 0) {
                instance = this;
            }
            return instance.prototype;
        };

        LoadingController.prototype.setLoadingView = function (loadingView) {
            return this.loadingView = loadingView;
        };

        LoadingController.prototype.setBundleView = function (bundleView) {
            return this.bundleView = bundleView;
        };
     
        LoadingController.prototype.initBundle = function (data) {
            return this.bundleView.initBundle(data);
        };
        LoadingController.prototype.loadBundle = function (bundleName, bundleCallback) {
            return this.bundleView.loadBundle(bundleName, bundleCallback);
        };
        LoadingController.prototype.loadSceneGame = function(bundleName, sceneName, callbackProgress, bundleCallback) {
            return this.bundleView.loadSceneGame(bundleName, sceneName, callbackProgress, bundleCallback);
        };
        
        LoadingController.prototype.loadPrefabGame = function(bundleName, prefabName, callbackProgress, bundleCallback) {
            return this.bundleView.loadPrefabGame(bundleName, prefabName, callbackProgress, bundleCallback);
        };
        LoadingController.prototype.loadPrefabPopup = function(prefabPath, cb) {
            return this.bundleView.loadPrefabPopup(prefabPath, cb);
        };

        return LoadingController;

    })();

    cc.LoadingController = LoadingController;

}).call(this);

