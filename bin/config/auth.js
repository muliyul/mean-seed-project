/**
 * Created by Muli Yulzary on 09-May-16.
 */
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const CustomStrategy = require('passport-custom').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const $q = require('q');

module.exports = function (app) {

    //<editor-fold desc="Session Serialization">
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (user, done) {
        User.findById(user.id, function (err, user) {
            done(err, user);
        });
    });
    //</editor-fold>

    //<editor-fold desc="Strategies">
    passport.use(new LocalStrategy({
        session: false
    }, function (usernameOrEmail, password, done) {
        User.findOne({
            $or: [
                {'identities.local.username': usernameOrEmail},
                {'identities.local.email': usernameOrEmail}
            ]
        }).select('+identities.local.password')
            .then(function (user) {
                if (!user)
                    return done(null, false);

                var defer = $q.defer();

                user.validatePassword(password, function (e) {
                    if (e) return defer.reject(e)
                    User.findById(user.id).then(defer.resolve)
                        .catch(defer.reject)
                });
                return defer.promise;
            })
            .then(function (user) {
                done(null, user);
            })
            .catch(done);
    }));

    passport.use('signup', new LocalStrategy({session: false}, function (usernameOrEmail, password, done) {
        User.findOne({
            $or: [
                {'identities.local.username': usernameOrEmail},
                {'identities.local.email': usernameOrEmail}
            ]
        }).then(function (user) {
            if (user)
                return done(null, false, 'Email or username already in use!');

            var local = {
                password: password
            };

            if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usernameOrEmail))
                local.email = usernameOrEmail;
            else
                local.username = usernameOrEmail;

            return User.create({
                identities: {
                    local: local
                }
            }).then(function (user) {
                done(null, user);
            }, done);
        });
    }));

    passport.use('facebook', new CustomStrategy(function (req, done) {
        var fbData = req.body.data;
        fbData.picture = 'http://graph.facebook.com/' + fbData.id + '/picture?type=large';
        try {
            fbData.birthday = Date(fbData.birthday)
        }
        catch (e) {
        }
        User.findOne({'identities.facebook.id': fbData.id})
            .then(function (user) {
                if (!user)
                    return User.create({
                        identities: {
                            facebook: fbData
                        }
                    });
                return user;
            })
            .then(function (user) {
                done(null, user);
            }, done);
    }));

    passport.use('google', new CustomStrategy(function (req, done) {
        var gData = req.body;
        User.findOne({'identities.google.id': gData.id})
            .then(function (user) {
                if (!user)
                    return User.create({
                        identities: {
                            google: gData
                        }
                    });
                return user;
            })
            .then(function (user) {
                done(null, user);
            }, done);
    }));

    passport.use(new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
        secretOrKey: app.get('keys').app.secret,
        session: false
    }, function (jwt_payload, done) {
        User.findById(jwt_payload.subject)
            .then(function (user) {
                if (!user)
                    return done();
                done(null, user);
            })
            .catch(done);
    }));
    //</editor-fold>

    function sendApiToken(req, res) {
        var token = jwt.sign({
            expiresIn: 2 * 7 * 24 * 60 * 60,
            issuer: app.get('name'),
            subject: req.user.id.toString(),
            role: 'user'
        }, app.get('keys').app.secret);
        res.setHeader('Authorization', 'Bearer ' + token.toString());
        res.json(req.user);
    }

    //<editor-fold desc="Auth paths">
    app.post('/auth/login/:method', function (req, res, next) {
        try {
            var method = req.params.method.toLowerCase();
            passport.authenticate(method)(req, res, next);
        }
        catch (e) {
            passport.authenticate('local')(req, res, next);
        }
    }, sendApiToken);
    app.post('/auth/signup', passport.authenticate('signup'), sendApiToken);
    //</editor-fold>

};