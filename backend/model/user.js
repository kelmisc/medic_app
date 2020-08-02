'use strict';
var db = require('../config/db.config');

var User = function(user){
    this.email = user.email;
    this.phone = user.phone;
    this.address = user.address;
    this.password = user.password;
    this.clinic = user.clinic;
};

User.create = function (user, result) {
    db.query("INSERT INTO users set ?", user, function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }else{
            console.log('ok')
            result(null, res);
        }
    }
)};

User.findByEmail = function (userEmail, result) {
    db.query("SELECT * FROM users WHERE email = ?", userEmail, function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }else{
            result(null, res);
        }
    }
)};

User.login = function (userEmail, password, result) {
    db.query("SELECT * FROM users WHERE email = ? and password = ?", [userEmail, password], function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }else{
            result(null, res);
        }
    }
)};

module.exports = User;