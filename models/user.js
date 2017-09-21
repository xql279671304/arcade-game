var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment')

var UserSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    rePassword: {
        type: String,
        require: true
    },
    blue: Number,
    green: Number,
    orange: Number,
    createAt: String,
    updateAt: String
});

UserSchema.pre('save', function(next){
    if(this.isNew){
        this.createAt = this.updateAt = moment().format('YYYY-MM-DD HH:MM:ss');
    }else{
        this.updateAt = moment().format('YYYY-MM-DD HH:MM:ss');
    }
    next()
});

module.exports = mongoose.model('User', UserSchema);