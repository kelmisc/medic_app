var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var cors = require('cors');

const session = require('express-session');
const usersRouter = require('./routes/users');
const recordRouter = require('./routes/records');
var app = express();

var port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/users', usersRouter);
app.use('/records', recordRouter);

app.use(function(request, response) {
    response.statusCode = 404;
    response.end("404!");
});

http.createServer(app).listen(port);