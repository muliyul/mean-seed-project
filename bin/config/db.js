/**
 * Created by Muli Yulzary on 09-May-16.
 */
const uriBuilder = require('mongo-uri-builder');

module.exports = {
    dev: uriBuilder({
        host: 'localhost',
        database: 'meanbp'
    }),
    prod: uriBuilder({
        username: 'muliyul',
        password: '12345678',
        host: 'ds023315.mlab.com',
        port: '23315',
        database: 'meanbp'
    })
};