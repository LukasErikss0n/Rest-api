const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const http = require('http');
const db = require("./server-con")
const port = 3000


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('public'))


app.get("/", (req, res) =>{
    res.send("<h1>Dokumentation av olika API</h1><p>/users - returnerar alla användare</p>")
})



const crypto = require('crypto');

function hash(data) {
    const hash = crypto.createHash('sha256');
    hash.update(data);
    return hash.digest('hex')
}
   

app.get("/users", async(req, res) =>{
    if (Object.keys(req.query).length > 0) {
        let id = req.query.id || null
        let age = req.query.age || null
        let users = await db.speUser(id, age)
        res.send(users)
    } else {
        let users = await db.users()
        res.send(users) 
    }
})

app.get("/users/:id", async (req,res) =>{
    let id = req.params.id
    let users = await db.speUser(id, null)
    res.send(users)
})

function  isValidUserData(body){
    return body && body.user_name
}

app.post("/posta-hit", async(req, res) =>{
    if(isValidUserData(req.body)){
        let name = req.body.user_name
        let age = req.body.age
        let userInfo = req.body.user_info

        let addPasswordHashed = hash(req.body.password)

        let ins = await db.addUser(name, addPasswordHashed,age, userInfo)
        let sendBack = {
            user_name: `${name}`,
            age: age,
            user_info: `${userInfo}`,
            id: ins.insertId
        }
        res.json(sendBack)

    }else{
        res.sendStatus(422)
    }
   
})

app.put("/users/:id", async(req,res) =>{
    if(isValidUserData(req.body)){
        let id = req.params.id
        let valueAge = 0
        let checkIfIdExist = await db.speUser(id, valueAge)
        console.log(checkIfIdExist)
        if(checkIfIdExist.length > 0){
            let name = req.body.user_name
            let age = req.body.age
            let userInfo = req.body.user_info

            let uppdate = await db.uppdateUser(name, age, userInfo, id)  
            
            let sendBack = {
                user_name: `${name}`,
                age: age,
                user_info: `${userInfo}`,
                id: `${id}`
            }
            res.json(sendBack)

        }else{
            res.sendStatus(422)
            
        }
        
    }else{
        res.sendStatus(422)
    }
   
})



app.post("/loggin", async(req, res) =>{
    let username = req.body.username
    let passwordHash = hash(req.body.password)
    let user = await db.login(username)
    if(passwordHash === user[0].password){
        let sendBack = {
            user_name: `${username}`,
            age: user[0].age,
            user_info: `${user[0].user_info}`,
            id: user[0].id
        }
        res.json(sendBack)
    }else{
        res.sendStatus(401)
    }
    
})



app.listen(port, ()=>{
    console.log("Lisining in port 3000")
})