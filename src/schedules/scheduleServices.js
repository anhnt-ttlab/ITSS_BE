import { query } from "../../server.js";

let getListSchedules = async (body) => {
    var sql = "SELECT * FROM schedules";
    try {
      const rows = await query(sql);
      return rows
    } catch(err) {
      console.log(err)
      throw err
    } finally {}
  }


  let findScheduleByInfo = async (body) => {
    var sql = "SELECT * FROM schedules where talent_id = ? and course_id = ? and class_id = ?";
    try {
      const rows = await query(sql, [body.talentId, body.courseId, body.classId]);
      return rows[0]
    } catch(err) {
      console.log(err)
      throw err
    } finally {}
  }
  
  let findSchedulesByCourseId = async (courseId) => {
    var sql = "SELECT * FROM schedules where course_id = ?";
    try {
      const rows = await query(sql, [courseId]);
      return rows
    } catch(err) {
      console.log(err)
      throw err
    } finally {}
  }

  let getListSchedulesByTalentId = async (talentId) => {
    try {
        var sql = "SELECT * FROM schedules where talent_id = ?";
        var values = [talentId]
        const rows = await query(sql, values);
        return rows
    } catch(err) {
        console.log(err)
        throw err
    } finally {}
  }

  let getListSchedulesByTalentIdWithOtherInfo = async (talentId) => {
    try {
        var sql = "SELECT * FROM schedules INNER JOIN courses ON schedules.course_id = courses.course_id INNER JOIN classes ON classes.class_id = schedules.class_id where talent_id = ?";
        var values = [talentId]
        const rows = await query(sql, values);
        return rows
    } catch(err) {
        console.log(err)
        throw err
    } finally {}
  }

async function createSchedule (body) {
    try {
      var sql = "INSERT INTO schedules (talent_id, course_id, mean_score, class_id) VALUES(?,?,0.0,?)";
      var values = [body.talentId, body.courseId, body.classId];
      var result = await query(sql, values);
      return result;
    } catch(error) {
      console.log(error)
      return false;
    }
    finally {}
}

async function deleteSchedule (body) {
  try {
    var sql = "DELETE FROM schedules WHERE talent_id = ? and course_id = ? and class_id";
    var values = [body.talentId, body.courseId, body.classId];
    await query(sql, values);
    return true;
  } catch(error) {
    console.log(error)
    return false;
  }
  finally {}
}

// async function updateSchedule (body) {
//   let schedules = await findSchedulesByEmail(body);
//   if (!schedules.length || schedules[0].schedule_id == body.schedule_id) {
//     try {
//       var sql = "UPDATE schedules SET name = ?, email = ?, avatar = ? WHERE schedule_id = ?;";
//       var values = [body.name, body.email, body.avatar, body.schedule_id];
//       await query(sql, values);
//       var result = await findSchedulesByEmail(body)
//     } catch(error) {
//       console.log(error)
//       throw error
//     }
//     finally {}
//     return result;
//   } else {
//     return false;
//   }
// }

// async function deleteScheduleById (id) {
//   let schedule = await findScheduleById(id);
//   if (schedule) {
//     try {
//       var sql = "DELETE FROM schedules WHERE schedule_id = ?";
//       var values = [id];
//       await query(sql, values);
//     } catch(error) {
//       console.log(error)
//       throw error
//     }
//     finally {}
//     return id;
//   } else {
//     return false;
//   }
// }

export {
    createSchedule,
    getListSchedules,
    deleteSchedule,
    findSchedulesByCourseId,
    findScheduleByInfo,
    getListSchedulesByTalentIdWithOtherInfo,
    // updateSchedule,
    getListSchedulesByTalentId
};