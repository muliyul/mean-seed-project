/**
 * Created by Muli Yulzary on 09-May-16.
 */
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    identities: {
        local: {
            username: String,
            password: {type: String, select: false, access: 'private'}
        },
        facebook: {
            id: {type: String, access: 'private'},
            first_name: {type: String, access: 'private'},
            last_name: {type: String, access: 'private'},
            email: {type: String, access: 'private'},
            birthday: {type: Date, access: 'private'},
            picture: String
        },
        google: {
            id: {type: String, access: 'private'},
            first_name: {type: String, access: 'private'},
            last_name: {type: String, access: 'private'},
            email: {type: String, access: 'private'},
            picture: String
        }
    }
});

UserSchema.methods.generateHash = function (password, done) {
    bcrypt.genSalt(10, function (e, salt) {
        if (e) return done(e);
        bcrypt.hash(password, salt, done);
    });
};

UserSchema.methods.validatePassword = function (password, done) {
    bcrypt.compare(password, this.identities.local.password, done);
};

UserSchema.pre('save', function (done) {
    var self = this;
    if (!this.isModified(this.identities.local.password) && !this.isNew)
        return done();


    this.generateHash(this.identities.local.password, function (e, hash) {
        self.identities.local.password = hash;
        done();
    });
});

module.exports = mongoose.model('User', UserSchema);