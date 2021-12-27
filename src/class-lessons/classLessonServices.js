import { query } from "../../server.js";

let findClassLessonsByClassId = async (classId) => {
  var sql = "SELECT * FROM classesLessons where class_id = ?";
  try {
    const rows = await query(sql, [classId]);
    return rows
  } catch(err) {
    console.log(err)
    throw err
  } finally {}
}

let findClassLessonByInfo = async (body) => {
    var sql = "SELECT * FROM classesLessons where class_id = ? and lesson_id = ?";
    try {
      const rows = await query(sql, [body.classId, body.lessonId]);
      return rows[0]
    } catch(err) {
      console.log(err)
      throw err
    } finally {}
  }

  async function updateClassLesson (body) {
    try {
    var sql = "UPDATE classesLessons SET time = ? WHERE class_id = ? AND lesson_id = ?;";
    var values = [body.time, body.classId, body.lessonId];
    await query(sql, values);
    } catch(error) {
    console.log(error)
    throw error
    }
    finally {}
    return true;
  }


export {
    findClassLessonsByClassId,
    updateClassLesson,
    findClassLessonByInfo
};