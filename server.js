import express from 'express'
import session from 'express-session'
import bodyParser from 'body-parser'
import expressValidator from 'express-validator'
import mysql from 'mysql'
import util from 'util'
import dotenv from 'dotenv'
import cors from 'cors'
import { managerRouter } from "./src/managers/managerControllers.js"
dotenv.config()

var app = express();
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://itss-fe.herokuapp.com");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});
// app.use(cors({
//   origin: 'https://itss-fe.herokuapp.com',
//   credentials: true,
//   allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept']
// }));
// app.use(cors());
app.listen(process.env.PORT || 7000,function(){
    console.log('Node server running @ http://localhost:7000')
});

var con = mysql.createConnection({
  host: process.env.DB_HOST || "us-cdbr-east-04.cleardb.com",
  user: process.env.DB_USERNAME || "b74937bf47e8f6",
  password: process.env.DB_PASSWORD || "4e6fcb13",
  database: process.env.DB_NAME || "heroku_b4a750ab3bbd554",
});
const query = util.promisify(con.query).bind(con);
app.use(expressValidator())
app.use(bodyParser.json());
app.use(session({
  key: 'session_cookie_name',
  secret: 'session_cookie_secret',
  resave: true,
  saveUninitialized: false
}));

app.use("/", managerRouter);
app.get('/public/home.html', function (req, res) {
  var sql = "SELECT * FROM talents";
  con.query(sql, function(err, results) {
    if (err) throw err;
    res.send(results);
  });
});

export { con, query };