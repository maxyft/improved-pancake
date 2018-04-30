const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fav = require('express-favicon');

var url = "mongodb://localhost/usersdb";
mongoose.connect(url);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));

const app = express();
const port = 8000;

app.use(fav(__dirname + '/public/favicon.png'));
app.use(bodyParser.urlencoded( { extended: true } ));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    next();
});

require('./app/routes')(app, db);

app.listen(port, () => {
	console.log('server listen on ' + port);
});
