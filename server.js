import express from 'express'
import session from 'express-session'
import bodyParser from 'body-parser'
import expressValidator from 'express-validator'
import mysql from 'mysql'
import util from 'util'
import dotenv from 'dotenv'
import cors from 'cors'
import { managerRouter } from "./src/managers/managerControllers.js"
import { talentRouter } from "./src/talents/talentControllers.js"
import { scheduleRouter } from "./src/schedules/scheduleControllers.js"
import { courseRouter } from "./src/courses/courseControllers.js"
import { lessonRouter } from "./src/lessons/lessonControllers.js"
import { scoreRouter } from "./src/scores/scoreControllers.js"
import { classLessonRouter } from "./src/class-lessons/classLessonControllers.js"
import { classRouter } from "./src/classes/classControllers.js"
import { talentClassRouter } from "./src/talent-classes/talentClassControllers.js"
import { scoreLessonRouter } from "./src/score-lessons/scoreLessonControllers.js"
import { meanScoreRouter } from "./src/mean-scores/meanScoresControllers.js"
dotenv.config()

var app = express();
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", process.env.FE_PORT);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE, PATCH");
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
app.use("/talent", talentRouter);
app.use("/course", courseRouter);
app.use("/schedule", scheduleRouter);
app.use("/lesson", lessonRouter);
app.use("/score", scoreRouter);
app.use("/class", classRouter);
app.use("/class-lesson", classLessonRouter);
app.use("/class-talent", talentClassRouter);
app.use("/score-lesson", scoreLessonRouter);
app.use("/mean-score", meanScoreRouter);
app.get('/public/home.html', function (req, res) {
  var sql = "SELECT * FROM talents";
  con.query(sql, function(err, results) {
    if (err) throw err;
    res.send(results);
  });
});

export { con, query };