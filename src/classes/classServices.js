import req from "express/lib/request.js";
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

let findScoresByClassIds = async (classIds) => {
  var sql = "SELECT * FROM scores where class_id IN ( ? ) GROUP BY talent_id";
  try {
    const rows = await query(sql, [classIds]);
    return rows
  } catch(err) {
    console.log(err)
    throw err
  } finally {}
}

let bulkInsertScores = async (scores) => {
  var sql = "INSERT INTO scores (score, talent_id, lesson_id, class_id) VALUES ?";
  try {
    const rows = await query(sql, [scores]);
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
    return result;
  } catch(error) {
    console.log(error)
    return false;
  }
  finally {}
}

let bulkInsertScores2 = async (scores) => {
  var sql = "INSERT INTO scores (score, talent_id, lesson_id, class_id) VALUES ?";
  try {
    const rows = await query(sql, [scores]);
    return rows
  } catch(err) {
    console.log(err)
    throw err
  } finally {}
}

let bulkCreateTalentClass = async (body) => {
  try {
    var newTalentClasses = [];
    var currentClass = await findClassById(body.classId);
    var newSchedules = [];
    await Promise.all(body.talentIds.map(async (item) => {
      newTalentClasses.push([body.classId, item]);
      newSchedules.push([item, currentClass.course_id,0.0, body.classId])
    }))
    var sql = "INSERT INTO talentClasses (class_id, talent_id) VALUES ?";
    await query(sql, [newTalentClasses]);
    var sqlSchedule = "INSERT INTO schedules (talent_id, course_id, mean_score, class_id) VALUES ?";
    await query(sqlSchedule, [newSchedules]);

    // var finalResult = await Promise.all(body.talentIds.map(async (item) => {
    //   var sql = "INSERT INTO talentClasses (class_id, talent_id) VALUES ?";
    //   await query(sql, [newTalentClasses]);
    //   var currentClass = await findClassById(body.classId)
    //   var sqlSchedule = "INSERT INTO schedules (talent_id, course_id, mean_score, class_id) VALUES(?,?,0.0,?)";
    //   var values = [item, currentClass.course_id, body.classId];
    //   await query(sqlSchedule, values);
    //   return 0
    // }))
    return 1;
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

  let getListClassesWithOtherInfo = async () => {
    try {
        var sql = "SELECT (SELECT COUNT(talent_id) AS talent_number FROM talentClasses where talentClasses.class_id = classes.class_id) as talent_number, classes.* , managers.full_name as creator_name, courses.course_name as course_name from classes INNER JOIN courses On classes.course_id = courses.course_id INNER JOIN managers On classes.creator_id = managers.manager_id";
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
    bulkCreateTalentClass,
    findTalentumberByClassId,
    bulkInsertScores,
    getListClassesWithOtherInfo,
    findScoresByClassIds,
    deleteTalentClassByInfo,
    createClassLesson
};