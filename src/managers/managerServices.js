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
  if (!user.length) {
    bcrypt.hash(body.password, 10, async (err, hash) => {
      if (err) {return next(err);}
      try {
        var sql = "INSERT INTO managers (full_name, email, password) VALUES(?,?,?)";
        var values = [body.full_name, body.email, hash];
        const rows = await query(sql, values);
        return rows
      } catch(err) {
        console.log(err)
        throw err
      }
      finally {}
    })
    return true;
  } else {
    return false;
  }
}

module.exports = {
  register,
};