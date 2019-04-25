const express = require('express')
const app = express()
const massive = require('massive')
const session = require('express-session')
require('dotenv').config()
const {SERVER_PORT, SESSION_SECRET, CONNECTION_STRING} = process.env
const AuthCtrl = require('./controllers/AuthController')

app.use(express.json())
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

app.post('/auth/register', AuthCtrl.register)
app.post('/auth/login', AuthCtrl.login)
app.get('/auth/logout', AuthCtrl.logout)

massive(CONNECTION_STRING).then(db =>{
  app.set('db', db)
  app.listen(SERVER_PORT, ()=>console.log(`Listening on port ${SERVER_PORT}`))
})