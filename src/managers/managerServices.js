let bcrypt = require('bcrypt')
const util = require('util');
var mysql = require('mysql');



var con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });
const query = util.promisify(con.query).bind(con);

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

async function register (body) {
  let user = await findManagers(body);
  let hashedPassword;
  if (!user.length) {
    hashedPassword = await bcrypt.hash(body.password, 10)
    try {
      var sql = "INSERT INTO managers (full_name, email, password) VALUES(?,?,?)";
      var values = [body.full_name, body.email, hashedPassword];
      await query(sql, values);
      result = await findManagers(body)
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
    return false;
  } else {
    let comparePass = await bcrypt.compare(req.body.password, user[0].password);
    if (comparePass === false) {
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


module.exports = {
  findManagers,
  register,
  signIn,
  isLogging
};