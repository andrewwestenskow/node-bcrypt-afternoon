const bcrypt = require('bcryptjs')

module.exports = {
  register: async (req, res) => {
    const db = req.app.get('db')
    const {username, password, isAdmin} = req.body

    let users = await db.get_user(username)
    let user = users[0]

    if(user){
      return res.status(409).send(`User already exists`)
    }

    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)

    let registeredUser = await db.register_user(isAdmin, username, hash)
    let newUser = registeredUser[0]

    delete newUser.hash

    req.session.user = newUser
    res.status(200).send(newUser)
  },

  login: async (req, res) => {
    const db = req.app.get('db')
    const {username, password} = req.body

    let users = await db.get_user(username)
    let user = users[0]
    

    if(!user){
      return res.status(401).send(`User not found.  Please register as a new user before logging in.`)
    }

    let isAuthenticated = await bcrypt.compareSync(password, user.hash)

    if(!isAuthenticated){
      return res.status(403).send(`Incorrect password`)
    }

    delete user.hash

    req.session.user = user
    res.status(200).send(req.session.user)
  },

  logout: (req, res)=> {
    req.session.destroy()
  return res.sendStatus(200)
  }
}