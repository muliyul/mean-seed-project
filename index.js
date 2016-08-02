/**
 * Created by Muli Yulzary on 09-May-16.
 */
const cluster = require('cluster');
const http = require('http');
const https = require('https');
const path = require('path');
const express = require('express');
const favicon = require('favicon');
const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const debug = require('debug')('app');
const fs = require('fs');
const config = require('./bin/config');
const dbs = config.database;

mongoose.Promise = require('q').Promise;

const app = express();
app.set('port', process.env.PORT || 3000);

app.use(cors());
app.use(compression());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(passport.initialize());
//app.use(favicon(path.join(__dirname, 'public/assets/icons/favicon.ico')));

require('./bin/config/auth')(app);

var oneDay = 86400000;
app.use(express.static(path.join(__dirname, 'public')/*, {maxAge: oneDay}*/));

app.use(require('./bin/routers/api'));
app.get('/*', function (req, res) {
    res.sendFile('index.html', {root: path.join(__dirname, 'public')});
});

mongoose.connect(dbs[config.mode], function (e) {
    if (e) throw e;
    debug('Connected to database');
    http.createServer(app).listen(app.get('port'), function (e) {
        if (e) {
            debug(e);
            throw e;
        }
        debug('HTTP server running on port %d', app.get('port'));
    });

    //Uncomment for HTTPS setup.
    /*
     https.createServer({
     'your': 'key'
     }, app).listen(443, e=> {
     if (e) {
     debug(e);
     throw e;
     }
     console.info('HTTPS server running on port %d', 443);
     });
     */
});
