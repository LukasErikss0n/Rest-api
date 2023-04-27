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

async function addUser(name, password, age, userInfo){
    const con = await connection()
    const result = await con.execute("INSERT users(user_name, password, age, user_info) VALUES(?, ?, ?, ?)", [name, password,age, userInfo])
    await con.end()
    return result[0]
}


async function uppdateUser(name, password, age, userInfo, id){
    const con = await connection()
    const result = await con.execute("UPDATE users SET user_name = ?, password = ?, age = ?, user_info = ? WHERE id = ?", [name, password, age, userInfo, id])
    await con.end()
    return result[0]
}

async function login(username){
    const con = await connection()
    const result = await con.execute("SELECT * FROM users WHERE user_name = ?", [username])
    await con.end()
    return result[0]
}



var jwt = require('jsonwebtoken')

async function authorization(req, res, SECRETHASH){
    let authHeader = req.headers['authorization']
    if(authHeader === undefined){
     res.status(401)
     res.send("Aunhotorized")
     return false
    }
    let token = authHeader.slice(7)   

    let verify
    try {
      verify = jwt.verify(token, SECRETHASH)
    } catch (err) {
      console.log(err) 
      res.status(401).send('Invalid auth token')
      return false
    }
    return verify
}

async function checkIfUserExists(name){
    const con = await connection()
    const result = await con.execute("SELECT * FROM users WHERE user_name = ?",[name])
    await con.end()
    return result[0]
}
module.exports = {
    users, speUser, addUser, uppdateUser, login, authorization, checkIfUserExists,
}