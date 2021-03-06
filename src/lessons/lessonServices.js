import { query } from "../../server.js";

async function createLesson (body) {
    try {
      var sql = "INSERT INTO lessons (lesson_name, course_id) VALUES(?,?)";
      var values = [body.lessonName, body.courseId];
      var result = await query(sql, values);
      return result.insertId;
    } catch(error) {
      console.log(error)
      return false;
    }
    finally {}
}

let findLessonByInfo = async (body) => {
  var sql = "SELECT * FROM lessons where lesson_name = ? and course_id = ?";
  try {
    const rows = await query(sql, [body.lessonName, body.courseId]);
    return rows[0]
  } catch(err) {
    console.log(err)
    throw err
  } finally {}
}

let getListLessonsByCourseId = async (courseId) => {
  try {
      var sql = "SELECT * FROM lessons where course_id = ?";
      var values = [courseId]
      const rows = await query(sql, values);
      return rows
  } catch(err) {
      console.log(err)
      throw err
  } finally {}
}

let getListLessonsByClassId = async (classId) => {
  try {
      var sql = "SELECT * FROM classesLessons where class_id = ?";
      var values = [classId]
      const rows = await query(sql, values);
      return rows
  } catch(err) {
      console.log(err)
      throw err
  } finally {}
}

let getListLessons = async () => {
    try {
        var sql = "SELECT * FROM lessons";
        const rows = await query(sql);
        return rows
    } catch(err) {
        console.log(err)
        throw err
    } finally {}
  }

  let findLessonById = async (id) => {
    var sql = "SELECT * FROM lessons where lesson_id = ?";
    try {
      const rows = await query(sql, [id]);
      return rows[0]
    } catch(err) {
      console.log(err)
      throw err
    } finally {}
  }

  async function updateLesson (body) {
    try {
    var sql = "UPDATE lessons SET lesson_name = ? WHERE lesson_id = ?;";
    var values = [body.lessonName, body.lessonId];
    await query(sql, values);
    } catch(error) {
    console.log(error)
    throw error
    }
    finally {}
    return true;
  }

  async function deleteLessonById (id) {
    let lesson = await findLessonById(id);
    if (lesson) {
      try {
        var sql = "DELETE FROM lessons WHERE lesson_id = ?";
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
    createLesson,
    getListLessons,
    findLessonById,
    updateLesson,
    findLessonByInfo,
    getListLessonsByClassId,
    deleteLessonById,
    getListLessonsByCourseId
};