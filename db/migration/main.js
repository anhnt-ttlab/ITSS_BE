import mysql from "mysql";
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

var con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");

  var sql =
    "CREATE TABLE managers (manager_id INT AUTO_INCREMENT, full_name VARCHAR(255), email VARCHAR(255), password VARCHAR(500), PRIMARY KEY (manager_id))";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table managers created");
  });

  var sql =
    "CREATE TABLE talents (talent_id INT AUTO_INCREMENT, name VARCHAR(255), email VARCHAR(255), avatar VARCHAR(2000), manager_id INT, PRIMARY KEY (talent_id), FOREIGN KEY (manager_id) REFERENCES managers(manager_id) ON DELETE CASCADE)";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table talents created");
  });

  var sql =
    "CREATE TABLE courses (course_id INT AUTO_INCREMENT, course_name VARCHAR(255), creator_id INT, PRIMARY KEY (course_id), FOREIGN KEY (creator_id) REFERENCES managers(manager_id) ON DELETE CASCADE)";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table courses created");
  });

  var sql =
    "CREATE TABLE lessons (lesson_id INT AUTO_INCREMENT, lesson_name VARCHAR(255), course_id INT, PRIMARY KEY (lesson_id), FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE)";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table lessons created");
  });

  var sql =
    "CREATE TABLE classes (class_id INT AUTO_INCREMENT, class_name VARCHAR(255), start_date VARCHAR(255), end_date VARCHAR(255), course_id INT, PRIMARY KEY (class_id), FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE)";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table classes created");
  });

  var sql =
    "CREATE TABLE scores (score INT, talent_id INT, lesson_id INT, FOREIGN KEY (talent_id) REFERENCES talents(talent_id) ON DELETE CASCADE, FOREIGN KEY (lesson_id) REFERENCES lessons(lesson_id) ON DELETE CASCADE)";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table scores created");
  });

  var sql =
    "CREATE TABLE schedules (mean_score FLOAT, talent_id INT, course_id INT, class_id INT, FOREIGN KEY (talent_id) REFERENCES talents(talent_id) ON DELETE CASCADE, FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE, FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE CASCADE)";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table schedules created");
  });

  var sql =
    "CREATE TABLE talentClasses (talent_id INT, class_id INT, FOREIGN KEY (talent_id) REFERENCES talents(talent_id) ON DELETE CASCADE, FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE CASCADE)";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table talentClasses created");
  });

  var sql =
    "CREATE TABLE classesLessons (class_id INT, lesson_id INT, time VARCHAR(255), FOREIGN KEY (lesson_id) REFERENCES lessons(lesson_id) ON DELETE CASCADE, FOREIGN KEY (class_id) REFERENCES classes(class_id) ON DELETE CASCADE)";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table classesLessons created");
  });

  var updateClassesTable2312 =
  "ALTER TABLE classes add column creator_id INT, ADD FOREIGN KEY (creator_id) REFERENCES managers(manager_id) ON DELETE CASCADE";
  con.query(updateClassesTable2312, function (err, result) {
  if (err) throw err;
  console.log("Table classesLessons created");
  });

  var updateScoresTable2612 =
  "ALTER TABLE itss.scores add column class_id INT, ADD FOREIGN KEY (class_id) REFERENCES itss.classes(class_id) ON DELETE CASCADE;";
  con.query(updateScoresTable2612, function (err, result) {
  if (err) throw err;
  console.log("Table classesLessons created");
  });
  
  
  return;
});
