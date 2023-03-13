const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const http = require('http');
const db = require("./server-con")
const port = 3000


app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'))


app.get("/", (req, res) =>{
    res.send("<h1>Dokumentation av olika API</h1><p>/user - returnerar alla användare</p>")
})


app.get("/users", async(req, res) =>{
    if (Object.keys(req.query).length > 0) {
        let id = req.query.id || null
        let age = req.query.age || null
        console.log("id", id)
        console.log("age", age)
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
    console.log(users)
    res.send(users)
})

app.listen(port, ()=>{
    console.log("Lisining in port 3000")
})