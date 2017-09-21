var express = require('express');
var app = express();
var path = require("path");
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var login = require('./routers/API.js');

//**
// mongodb://127.0.0.1:27000/arcadeGame
var dbUrl = 'mongodb://101.37.204.216:27017/atest';

mongoose.Promise = global.Promise;
mongoose.connect(dbUrl);

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('', login);

var server = app.listen(8089, function() {
    console.log('Listening on port %d', server.address().port);
});