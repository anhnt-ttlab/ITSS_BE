import { query } from "../../server.js";

async function createClass (body) {
    try {
      var sql = "INSERT INTO classes (class_name, course_id, start_date, end_date, creator_id) VALUES(?,?,?,?,?)";
      var values = [body.className, body.courseId, body.startDate, body.endDate, body.creatorId];
      var result = await query(sql, values);
      return result.insertId;
    } catch(error) {
      console.log(error)
      return false;
    }
    finally {}
}

let findClassByInfo = async (body) => {
  var sql = "SELECT * FROM classes where class_name = ? and course_id = ?";
  try {
    const rows = await query(sql, [body.className, body.courseId]);
    return rows[0]
  } catch(err) {
    console.log(err)
    throw err
  } finally {}
}

let findClassByCourseId = async (courseId) => {
  var sql = "SELECT * FROM classes where course_id = ?";
  try {
    const rows = await query(sql, [courseId]);
    return rows
  } catch(err) {
    console.log(err)
    throw err
  } finally {}
}

let findClassLessonByInfo = async (body) => {
  var sql = "SELECT * FROM classesLessons where class_id = ? and lesson_id = ?";
  try {
    const rows = await query(sql, [body.classId,body.lessonId]);
    return rows[0]
  } catch(err) {
    console.log(err)
    throw err
  } finally {}
}


async function createClassLesson (body) {
    try {
      var sql = "INSERT INTO classesLessons (class_id, lesson_id, time) VALUES(?,?,?)";
      var values = [body.classId, body.lessonId, body.time];
      var result = await query(sql, values);
      return result.insertId;
    } catch(error) {
      console.log(error)
      return false;
    }
    finally {}
}

async function createTalentClass (body) {
  try {
    var sql = "INSERT INTO talentClasses (class_id, talent_id) VALUES(?,?)";
    var values = [body.classId, body.talentId];
    var result = await query(sql, values);
    return result.insertId;
  } catch(error) {
    console.log(error)
    return false;
  }
  finally {}
}

let findTalentumberByClassId = async (classId) => {
  var sql = "SELECT COUNT(talent_id) AS talent_number FROM talentClasses where class_id = ?";
  try {
    const result = await query(sql, [classId]);
    return result
  } catch(err) {
    console.log(err)
    throw err
  } finally {}
}

// let findClassNumberByClassId = async (classeId) => {
//   var sql = "SELECT COUNT(class_id) AS class_number FROM classes where classe_id = ?";
//   try {
//     const result = await query(sql, [classeId]);
//     return result
//   } catch(err) {
//     console.log(err)
//     throw err
//   } finally {}
// }

let getListClasses = async () => {
    try {
        var sql = "SELECT * FROM classes";
        const rows = await query(sql);
        return rows
    } catch(err) {
        console.log(err)
        throw err
    } finally {}
  }

  let findClassById = async (id) => {
    var sql = "SELECT * FROM classes where class_id = ?";
    try {
      const rows = await query(sql, [id]);
      return rows[0]
    } catch(err) {
      console.log(err)
      throw err
    } finally {}
  }

  async function updateClass (body) {
    try {
    var sql = "UPDATE classes SET class_name = ?, course_id = ?, start_date = ?, end_date = ? WHERE class_id = ?;";
    var values = [body.className, body.courseId, body.startDate, body.endDate, body.classId];
    await query(sql, values);
    } catch(error) {
    console.log(error)
    throw error
    }
    finally {}
    return true;
  }

  async function deleteClassById (id) {
    let classe = await findClassById(id);
    if (classe) {
      try {
        var sql = "DELETE FROM classes WHERE class_id = ?";
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

  async function deleteTalentClassByInfo (body) {
    let classe = await findClassById(body.class_id);
    if (classe) {
      try {
        var sql = "DELETE FROM talentClasses WHERE class_id = ? and talent_id = ?";
        var values = [body.class_id, body.talent_id];
        await query(sql, values);
      } catch(error) {
        console.log(error)
        throw error
      }
      finally {}
      return 0;
    } else {
      return false;
    }
  }

export {
    createClass,
    getListClasses,
    findClassById,
    updateClass,
    findClassByInfo,
    deleteClassById,
    findClassLessonByInfo,
    createTalentClass,
    findClassByCourseId,
    findTalentumberByClassId,
    deleteTalentClassByInfo,
    createClassLesson
};