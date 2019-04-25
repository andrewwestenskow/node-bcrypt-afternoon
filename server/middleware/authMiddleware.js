module.exports = {
  usersOnly (req, res, next) {
    if(req.session.user){
      next()
    } else {
      return res.status(401).send(`Please log in`)
    }
  },

  adminOnly(req, res, next) {
    console.log(req.session.user)
    if(!req.session.user.is_admin){
      return res.status(403).send(`You are not an admin`)
    }

    next()
  }
}