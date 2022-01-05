import { query } from "../../server.js";

async function createCourse (body) {
    try {
      var sql = "INSERT INTO courses (course_name, creator_id) VALUES(?,?)";
      var values = [body.courseName, body.creatorId];
      var result = await query(sql, values);
      return result.insertId;
    } catch(error) {
      console.log(error)
      return false;
    }
    finally {}
}

let findCourseByInfo = async (body) => {
  var sql = "SELECT * FROM courses where course_name = ?";
  try {
    const rows = await query(sql, [body.courseName]);
    return rows[0]
  } catch(err) {
    console.log(err)
    throw err
  } finally {}
}

let findLessonNumberByCourseId = async (courseId) => {
  var sql = "SELECT COUNT(lesson_id) AS lesson_number FROM lessons where course_id = ?";
  try {
    const result = await query(sql, [courseId]);
    return result
  } catch(err) {
    console.log(err)
    throw err
  } finally {}
}

let findClassNumberByCourseId = async (courseId) => {
  var sql = "SELECT COUNT(class_id) AS class_number FROM classes where course_id = ?";
  try {
    const result = await query(sql, [courseId]);
    return result
  } catch(err) {
    console.log(err)
    throw err
  } finally {}
}

let getListCourses = async () => {
    try {
        var sql = "SELECT * FROM courses";
        const rows = await query(sql);
        return rows
    } catch(err) {
        console.log(err)
        throw err
    } finally {}
  }

  let getListCoursesWithOtherInfo = async () => {
    try {
        var sql = "SELECT (SELECT COUNT(class_id) AS class_number FROM classes where classes.course_id = courses.course_id) as class_number, COUNT(lesson_id) AS lesson_number, courses.*, managers.full_name as creator_name FROM courses INNER JOIN managers ON managers.manager_id = courses.creator_id INNER JOIN lessons ON lessons.course_id = courses.course_id GROUP BY lessons.lesson_id";
        const rows = await query(sql);
        return rows
    } catch(err) {
        console.log(err)
        throw err
    } finally {}
  }

  let findCourseById = async (id) => {
    var sql = "SELECT * FROM courses where course_id = ?";
    try {
      const rows = await query(sql, [id]);
      return rows[0]
    } catch(err) {
      console.log(err)
      throw err
    } finally {}
  }

  async function updateCourse (body) {
    try {
    var sql = "UPDATE courses SET course_name = ? WHERE course_id = ?;";
    var values = [body.courseName, body.courseId];
    await query(sql, values);
    } catch(error) {
    console.log(error)
    throw error
    }
    finally {}
    return true;
  }

  async function deleteCourseById (id) {
    let course = await findCourseById(id);
    if (course) {
      try {
        var sql = "DELETE FROM courses WHERE course_id = ?";
        var values = [id];
        await query(sql, values);
      } catch(error) {
        console.log(error)
        throw error
      }
      finally {}
      return id;
    } else {
      return false;
    }
  }

export {
    createCourse,
    getListCourses,
    findCourseById,
    updateCourse,
    findCourseByInfo,
    getListCoursesWithOtherInfo,
    deleteCourseById,
    findLessonNumberByCourseId,
    findClassNumberByCourseId
};