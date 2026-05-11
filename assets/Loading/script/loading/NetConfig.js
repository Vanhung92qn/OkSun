// Single source of truth cho domain. Đổi HOST → toàn bộ URL tự compute.
var HOST = 'oksun.win';
var PROTOCOL = 'https';

module.exports = {
    HOST_U: '',
    IS_APPSTORE: false,
    PORTAL: 'test',
    HOST: HOST,
    FB_LOGIN_URL: 'http://fbook.' + HOST + '/Home/FbLogin',

    // Derived URLs (không hardcode subdomain — sửa HOST thay mọi thứ)
    FISH_API_URL: PROTOCOL + '://fishapi.' + HOST,
    ASSET_CDN_URL: PROTOCOL + '://game.' + HOST + '/assets/',
    VERSION_JSON_URL: PROTOCOL + '://res.' + HOST + '/version.json',
    REMOTE_ASSETS_URL: PROTOCOL + '://res.' + HOST + '/remote-assets/',
    DOWNLOAD_APK_URL: PROTOCOL + '://' + HOST + '/sun.apk',
    MAIN_URL: PROTOCOL + '://' + HOST,

    PING_TIME: 5,
    RECONNECT_TIME: 5,
    bundledata: {},
    IS_LOCAL: true,
};
