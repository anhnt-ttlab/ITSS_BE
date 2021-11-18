var express = require('express');
var mysql = require('mysql');
require('dotenv').config()

var app = express();
app.listen(6000,function(){
    console.log('Node server running @ http://localhost:6000')
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

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/public/home.html', function (req, res) {
  var sql = "SELECT * FROM temp";
  con.query(sql, function(err, results) {
    if (err) throw err;
    res.send(results);
  });
});