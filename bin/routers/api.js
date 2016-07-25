const router = require('express').Router();
const mongoose = require('mongoose');
const restify = require('express-restify-mongoose');
const passport = require('passport');
const User = require('../models/user');

restify.defaults({version: ''});

router.get('/api', function (req, res) {
    res.json({
        Users: '/users/:id'
    })
});

restify.serve(router, User, {
    name: 'users',
    preRead: authMiddleware(true),
    preUpdate: authMiddleware(true),
    preDelete: methodNotAllowed
});

function authMiddleware(optionalAuth) {
    return function (req, res, next) {
        passport.authenticate('jwt', function (err, user, info) {
            req.user = user;

            //Don't pass error if optional.
            next(optionalAuth ? null : err, user);
        })(req, res, next);
    }
}

function methodNotAllowed(req, res) {
    res.status(405).json({error: {message: 'Method not allowed'}});
}

module.exports = router;