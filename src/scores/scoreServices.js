import { query } from "../../server.js";

let getListScoresByInfo = async (body) => {
    var sql = "SELECT scores.*, talents.*, lessons.*, classesLessons.time FROM scores INNER JOIN talents ON scores.talent_id = talents.talent_id INNER JOIN lessons ON lessons.lesson_id = scores.lesson_id INNER JOIN classesLessons ON classesLessons.class_id = ? and classesLessons.lesson_id = scores.lesson_id where scores.talent_id = ? and scores.class_id = ?";
    var values = [body.classId, body.talentId, body.classId]
    try {
      const rows = await query(sql, values);
      return rows
    } catch(err) {
      console.log(err)
      throw err
    } finally {}
  }


  let findScoreByInfo = async (body) => {
    var sql = "SELECT * FROM scores where talent_id = ? and lesson_id = ?";
    try {
      const rows = await query(sql, [body.talentId, body.lessonId]);
      return rows[0]
    } catch(err) {
      console.log(err)
      throw err
    } finally {}
  }
  

  let findScoreByInfoWithMoreInfo = async (body) => {
    var sql = "SELECT * FROM scores INNER JOIN talents ON scores.talent_id = talents.talent_id INNER JOIN lessons ON scores.lesson_id = lessons.lesson_id where scores.talent_id = ? and scores.lesson_id = ?";
    try {
      const rows = await query(sql, [body.talentId, body.lessonId]);
      return rows[0]
    } catch(err) {
      console.log(err)
      throw err
    } finally {}
  }

  let getListScoresByTalentId = async (talentId) => {
    try {
        var sql = "SELECT * FROM scores where talent_id = ?";
        var values = [talentId]
        const rows = await query(sql, values);
        return rows
    } catch(err) {
        console.log(err)
        throw err
    } finally {}
  }

async function createScore (body) {
    try {
      var sql = "INSERT INTO scores (talent_id, lesson_id, class_id, score) VALUES(?,?,?,0.0)";
      var values = [body.talentId, body.lessonId, body.classId];
      await query(sql, values);
      return true;
    } catch(error) {
      console.log(error)
      return false;
    }
    finally {}
}

async function deleteScore (body) {
  try {
    var sql = "DELETE FROM scores WHERE talent_id = ? and course_id = ?";
    var values = [body.talentId, body.courseId];
    await query(sql, values);
    return true;
  } catch(error) {
    console.log(error)
    return false;
  }
  finally {}
}

async function updateScore (body) {
    try {
      var sql = "UPDATE scores SET score = ? WHERE talent_id = ? and lesson_id = ? and class_id = ?;";
      var values = [body.score, body.talentId, body.lessonId, body.classId];
      await query(sql, values);
    } catch(error) {
      console.log(error)
      throw error
    }
    finally {}
    return 0;
}

async function updateScores (body) {
  try {
    const queryString = "UPDATE scores SET score = CASE 'talentId' "
    await Promise.all(body.map(async (item) => {
      queryString = queryString.concat("WHEN " + item.talent_id + " THEN " + item.score )
    }))
    console.log("query bulk update scores: ", queryString);
    await query(queryString);
    // var sql = "UPDATE scores SET score = ? WHERE talent_id = ? and lesson_id = ? and class_id = ?;";
    // var values = [body.score, body.talentId, body.lessonId, body.classId];
    // await query(sql, values);
  } catch(error) {
    console.log(error)
    throw error
  }
  finally {}
  return 0;
}

async function updateMeanScore (body) {
  try {
    await Promise.all(body.talentIds.map(async (item) => {
      var findScoreSql = "SELECT * FROM scores WHERE talent_id = ? and class_id = ?;";
      var valuesFindScore = [item, body.classId];
      var mean_score = 0.0;
      var scoreList = await query(findScoreSql, valuesFindScore);
      if (scoreList.length) {
        await Promise.all(scoreList.map(async (item) => {
          mean_score = mean_score + item.score
          return 0
        }))
        mean_score = mean_score/scoreList.length
        var updateMeanScoreSql = "UPDATE schedules SET mean_score = ? WHERE talent_id = ? and class_id = ?;";
        var valuesUpdateMeanScoreSql = [mean_score, item, body.classId];
        await query(updateMeanScoreSql, valuesUpdateMeanScoreSql);
      }
    }))
  } catch(error) {
    console.log(error)
    throw error
  }
  finally {}
  return 0;
}

async function calMeanScore (courseId) {
  try {
    var findScoreSql = "SELECT * FROM schedules WHERE course_id = ?";
    var valuesFindScore = [courseId];
    var mean_score = 0.0;
    var scoreList = await query(findScoreSql, valuesFindScore);
    if (scoreList.length) {
      await Promise.all(scoreList.map(async (item) => {
        mean_score = mean_score + item.mean_score
        return 0
      }))
      mean_score = mean_score/scoreList.length
      return mean_score;
    }
  } catch(error) {
    console.log(error)
    throw error
  }
  finally {}
  return 0;
}

async function deleteScoreById (id) {
  let score = await findScoreById(id);
  if (score) {
    try {
      var sql = "DELETE FROM scores WHERE score_id = ?";
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
    createScore,
    getListScoresByInfo,
    deleteScore,
    updateMeanScore,
    findScoreByInfoWithMoreInfo,
    updateScores,
    findScoreByInfo,
    deleteScoreById,
    calMeanScore,
    updateScore,
    getListScoresByTalentId
};