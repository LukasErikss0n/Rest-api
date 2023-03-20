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
    await con.end()
    return result[0]
}
async function speUser(id, age){
    const con = await connection()
    const result = await con.execute("SELECT * FROM users WHERE id = ? or age = ?", [id, age])
    await con.end()
    return result[0]
}

async function addUser(name, age, userInfo){
    const con = await connection()
    const result = await con.execute("INSERT users(user_name, age, user_info) VALUES(?, ?, ?)", [name, age, userInfo])
    await con.end()
    return result[0]
}


async function uppdateUser(name, age, userInfo, id){
    const con = await connection()
    const result = await con.execute("UPDATE users SET user_name = ?, age = ?, user_info = ? WHERE id = ?", [name, age, userInfo, id])
    await con.end()
    return result[0]
}
module.exports = {
    users, speUser, addUser, uppdateUser,
}