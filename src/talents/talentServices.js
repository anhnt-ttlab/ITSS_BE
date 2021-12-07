import { query } from "../../server.js";


let findTalentsByEmail = async (body) => {
  var sql = "SELECT * FROM talents where email = ?";
  try {
    const rows = await query(sql, [body.email]);
    return rows
  } catch(err) {
    console.log(err)
    throw err
  } finally {}
}

let findTalentById = async (id) => {
  var sql = "SELECT * FROM talents where talent_id = ?";
  try {
    const rows = await query(sql, [id]);
    return rows[0]
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

let getListTalents = async (body) => {
    var sql = "SELECT * FROM talents";
    try {
      const rows = await query(sql);
      return rows
    } catch(err) {
      console.log(err)
      throw err
    } finally {}
  }

async function createTalent (body) {
  let talents = await findTalentsByEmail(body);
  if (!talents.length) {
    try {
      var sql = "INSERT INTO talents (name, email, avatar, manager_id) VALUES(?,?,?,?)";
      var values = [body.name, body.email, body.avatar, body.manager_id];
      await query(sql, values);
      var result = await findTalentsByEmail(body)
    } catch(error) {
      console.log(error)
      throw error
    }
    finally {}
    return result;
  } else {
    return false;
  }
}

async function updateTalent (body) {
  let talents = await findTalentsByEmail(body);
  if (!talents.length || talents[0].talent_id == body.talent_id) {
    try {
      var sql = "UPDATE talents SET name = ?, email = ?, avatar = ? WHERE talent_id = ?;";
      var values = [body.name, body.email, body.avatar, body.talent_id];
      await query(sql, values);
      var result = await findTalentById(body.talent_id)
    } catch(error) {
      console.log(error)
      throw error
    }
    finally {}
    return result;
  } else {
    return false;
  }
}

async function deleteTalentById (id) {
  let talent = await findTalentById(id);
  if (talent) {
    try {
      var sql = "DELETE FROM talents WHERE talent_id = ?";
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
    findTalentsByEmail,
    createTalent,
    getListTalents,
    deleteTalentById,
    updateTalent,
    findTalentById,
    findCourseById
};