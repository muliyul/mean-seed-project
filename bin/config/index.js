/**
 * Created by muliyul on 18-Jul-16.
 */
const uriBuilder = require('mongo-uri-builder');
const ENV = {
    DEV: 'dev',
    PROD: 'prod'
    //You can add more environments here
};

var baseUrl = {};
baseUrl[ENV.DEV] = 'localhost';
baseUrl[ENV.PROD] = 'domain.com';

var db = {};
db[ENV.DEV] = uriBuilder({
    host: 'localhost',
    database: 'meanbp'
});
db[ENV.PROD] = uriBuilder({
    username: 'muliyul',
    password: '12345678',
    host: 'ds023315.mlab.com',
    port: '23315',
    database: 'meanbp'
});

const keys = {
    app: {
        secret: 'appSecret1@!#4#@'
    },
    google: {},
    facebook: {
        appId: '145922565834003',
        appSecret: 'cd090a96278153621aad6d1041389ad5'
    }
};

const APP_NAME = 'meanbp';

module.exports = {
    ENV: ENV,
    configure: function (app, mode) {
        mode = mode || ENV.DEV;
        app.set('name', APP_NAME);
        app.set('mode', mode);
        app.set('baseUrl', baseUrl[mode]);
        app.set('db', db[mode]);
        app.set('keys', keys);
        require('./auth')(app);
    }
}