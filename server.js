var express = require('express');
let session = require('express-session');
let bodyParser = require('body-parser');
let expressValidator = require('express-validator')
var mysql = require('mysql');
require('dotenv').config()

var app = express();
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});
app.listen(7000,function(){
    console.log('Node server running @ http://localhost:7000')
});

var con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!!!")
});

app.use(expressValidator())
app.use(bodyParser.json());
app.use(session({
  key: 'session_cookie_name',
  secret: 'session_cookie_secret',
  resave: true,
  saveUninitialized: false
}));

app.use("/", require("./src/managers/managerControllers"));
app.get('/public/home.html', function (req, res) {
  var sql = "SELECT * FROM talents";
  con.query(sql, function(err, results) {
    if (err) throw err;
    res.send(results);
  });
});
