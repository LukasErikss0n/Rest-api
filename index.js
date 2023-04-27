const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const http = require('http');
const db = require("./server-con")
const port = 3000
const crypto = require('crypto');



app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('public'))


app.get("/", (req, res) =>{
    res.send(`<h1>Dokumentation av olika API</h1>
    <ul><li> GET /users - returnerar alla användare (behöver vara inloggad)</li>
    <li>GET /users?id=x&age=y - returnerar alla användare som matchar nyklarna, OBS! båda nycklar behövs inte, välj vilken som passar bäst</li>
    <li>GET /users:id - returnerar användare med id:et (Behöver vara inloggad) </li>
    <li>POST /posta-hit - skapa ett konto</li>
    <li>POST /loggin - logga in på ditt konto </li>
    <li>PUT /user:id - Uppdatera användares information</li>
    
    </ul>`)
})


function hash(data) {
    const hash = crypto.createHash('sha256');
    hash.update(data);
    return hash.digest('hex')
}
   
app.get("/users", async(req, res) =>{
    let userInfo = db.authorization(req,res, SECRETHASH)
    if (userInfo != false){
        if (Object.keys(req.query).length > 0) {
            let id = req.query.id || null
            let age = req.query.age || null
            let users = await db.speUser(id, age)
            res.send(users)
        } else {
            let users = await db.users()
            res.send(users) 
        }
    }
})

app.get("/users/:id", async (req,res) =>{
    let userInfo = db.authorization(req,res, SECRETHASH)
    if (userInfo != false){
        let id = req.params.id
        let users = await db.speUser(id, null)
        res.send(users)
    }
    
})

function  isValidUserData(body){
    return body && body.user_name
}

app.post("/posta-hit", async(req, res) =>{
    if(isValidUserData(req.body)){
        let name = req.body.user_name
        let usernameAlreadyExists = await db.checkIfUserExists(name)
        if(usernameAlreadyExists.length < 1){
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
            res.send("Username already exist")
        }

    }else{
        res.sendStatus(422)
    }
   
})

app.put("/users/:id", async(req,res) =>{
    if(isValidUserData(req.body)){
        let id = req.params.id
        let valueAge = null
        let checkIfIdExist = await db.speUser(id, valueAge)
        if(checkIfIdExist.length > 0){
            let name = req.body.user_name
            let usernameAlreadyExists = await db.checkIfUserExists(name)
            if(usernameAlreadyExists.length < 1){
                let age = req.body.age
                let userInfo = req.body.user_info
                let password = hash(req.body.password)

    
                let uppdate = await db.uppdateUser(name, password, age, userInfo, id)  
                
                let sendBack = {
                    user_name: `${name}`,
                    age: age,
                    user_info: `${userInfo}`,
                    id: `${id}`
                }
                res.json(sendBack)
            }else{
                res.send("user already exists")
            }
           

        }else{
            res.sendStatus(422)
        }
        
    }else{
        res.sendStatus(421)
    }
   
})



var jwt = require('jsonwebtoken')
const SECRET = "hard to crack"
const SECRETHASH = hash(SECRET)

app.post("/loggin", async(req, res) =>{
    let username = req.body.username
    let passwordHash = hash(req.body.password)
    let user = await db.login(username)
    if(passwordHash === user[0].password){
        let payload ={
            sub: user[0].id,
            name: `${username}`,
            role: user[0].role || null,
            expiresIn: '1h',
        }
        let token = jwt.sign(payload, SECRETHASH)
        res.json(token)
    }else{
        res.sendStatus(401)
    }  
})




app.listen(port, ()=>{
    console.log(`Lisining on port ${port}` )
})