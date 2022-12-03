var express = require('express');
var env = require('dotenv').config()
var ejs = require('ejs');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
require('dotenv').config()
const mongoose = require('mongoose')
var express = require('express');
var app = express();
var session = require('express-session');
const MongoStore = require('connect-mongo')(session);

mongoose.connect('mongodb+srv://AndyWan:AndyWan@cluster0.sm2cgbf.mongodb.net/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err) => {
  if (!err) {
    console.log('MongoDB Connection Succeeded.');
  } else {
    console.log('Error in DB connection : ' + err);
  }
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {});

app.use(session({
  secret: 'uas',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static(__dirname + '/views'));

var index = require('./routes/index');
app.use('/', index);

app.use(function(req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});


app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});

let PORT = process.env.PORT;
app.listen(PORT, function() {
  console.log(`Server is running on ${process.env.PORT}`);
});