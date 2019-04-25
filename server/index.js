const express = require('express')
const app = express()
const massive = require('massive')
const session = require('express-session')
require('dotenv').config()
const {SERVER_PORT, SESSION_SECRET, CONNECTION_STRING} = process.env
const AuthCtrl = require('./controllers/AuthController')
const TreasureCtrl = require('./controllers/TreasureController')
const auth = require('./middleware/authMiddleware')

app.use(express.json())
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

app.post('/auth/register', AuthCtrl.register)
app.post('/auth/login', AuthCtrl.login)
app.get('/auth/logout', AuthCtrl.logout)
app.get('/api/treasure/dragon', TreasureCtrl.dragonTreasure)
app.get('/api/treasure/user', auth.usersOnly, TreasureCtrl.getUserTreasure)
app.post('/api/treasure/user', auth.usersOnly, TreasureCtrl.addUserTreasure)
app.get('/api/treasure/all', auth.usersOnly, auth.adminOnly, TreasureCtrl.getAllTreasure)



massive(CONNECTION_STRING).then(db =>{
  app.set('db', db)
  app.listen(SERVER_PORT, ()=>console.log(`Listening on port ${SERVER_PORT}`))
})