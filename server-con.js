const mysql = require('mysql2/promise');

async function connection(){
    return mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "restapi"
    });
}

async function users(){
    const con = await connection()
    const result = await con.execute("SELECT * FROM users ")
    //WHERE input = ?", [input]

    await con.end()
    return result[0]
}
async function speUser(id, age){
    const con = await connection()
    console.log(id, age)
    const result = await con.execute("SELECT * FROM users WHERE id = ? or age = ?", [id, age])
    await con.end()
    return result[0]
}

module.exports = {
    users, speUser,
}