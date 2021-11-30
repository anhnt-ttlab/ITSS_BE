import bcrypt from 'bcrypt'
import { con, query } from "../../server.js";


let findManagers = async (body) => {
  var sql = "SELECT * FROM managers where email = ?";
  try {
    const rows = await query(sql, [body.email]);
    return rows
  } catch(err) {
    console.log(err)
    throw err
  } finally {}
}

let findManagerById = async (id) => {
  var sql = "SELECT * FROM managers where manager_id = ?";
  try {
    const rows = await query(sql, [id]);
    return rows[0]
  } catch(err) {
    console.log(err)
    throw err
  } finally {}
}

async function register (body) {
  let user = await findManagers(body);
  let hashedPassword;
  if (!user.length) {
    hashedPassword = await bcrypt.hash(body.password, 10)
    try {
      var sql = "INSERT INTO managers (full_name, email, password) VALUES(?,?,?)";
      var values = [body.full_name, body.email, hashedPassword];
      await query(sql, values);
      var result = await findManagers(body)
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

let signIn = async (req) => {
  let user = await findManagers(req.body);
  if (!user.length) {
    con.end()
    return false;
  } else {
    let comparePass = await bcrypt.compare(req.body.password, user[0].password);
    if (comparePass === false) {
      con.end()
      return false;
    } else {
      req.session.user = user;
      return user;
    }
  };
};

let isLogging = async (req) => {
  if (req.session && req.session.user) {
    return true;
  } else {
    return false;
  }
}


export {
  findManagers,
  register,
  signIn,
  isLogging,
  findManagerById
};