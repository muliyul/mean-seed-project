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
    preDelete: methodNotAllowed,
    access: function (req, done) {
        passport.authenticate('jwt', function (err, user, info) {
            if(user && req.params.id){
                if(user.id === req.params.id)
                    return done(null, 'private');
            }
            done(null, 'public');
        })(req, req.res);
    }
});

function methodNotAllowed(req, res) {
    res.status(405).json({error: {message: 'Method not allowed'}});
}

module.exports = router;