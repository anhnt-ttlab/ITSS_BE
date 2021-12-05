import { query } from "../../server.js";

let getListScoresByInfo = async (body) => {
    var sql = "SELECT * FROM scores where talent_id = ? AND course_id = ?";
    var values = [body.talentId, body.courseId]
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
      console.log("body", body)
      var sql = "INSERT INTO scores (talent_id, course_id, lesson_id, score) VALUES(?,?,?,0.0)";
      var values = [body.talentId, body.courseId, body.lessonId];
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
      var sql = "UPDATE scores SET score = ? WHERE talent_id = ? and lesson_id = ?;";
      var values = [body.score, body.talentId, body.lessonId];
      await query(sql, values);
      var result = await findScoreByInfo(body)
      var findScoreSql = "SELECT * FROM scores WHERE talent_id = ? and course_id = ?;";
      var valuesFindScore = [result.talent_id, result.course_id];
      var mean_score = 0.0;
      var scoreList = await query(findScoreSql, valuesFindScore);
      if (scoreList.length) {
        await Promise.all(scoreList.map(async (item) => {
          mean_score = mean_score + item.score
          return 0
        }))
        mean_score = mean_score/scoreList.length
        var updateMeanScoreSql = "UPDATE schedules SET mean_score = ? WHERE talent_id = ? and course_id = ?;";
        var valuesUpdateMeanScoreSql = [mean_score, result.talent_id, result.course_id];
        await query(updateMeanScoreSql, valuesUpdateMeanScoreSql);
      }
    } catch(error) {
      console.log(error)
      throw error
    }
    finally {}
    return result;
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
    findScoreByInfo,
    deleteScoreById,
    updateScore,
    getListScoresByTalentId
};