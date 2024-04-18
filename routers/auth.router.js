const app = require('express')
const passport = require('passport')
const { isLoggedIn } = require('../middleware')
const authRouter = app.Router()

authRouter.get('/login', (req, res) => {
  res.render('login')
})

authRouter.post(
  '/login',
  passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login',
  }),
  async (req, res) => {
    req.flash('success', 'Welcome back!')
    res.redirect('/welcome')
  }
)

authRouter.get('/logout', isLoggedIn, async (req, res) => {
  req.logout(req.user, (err) => {
    if (err) return next(err)
    req.flash('success', 'Goodbye!')
    res.redirect('/login')
  })
})

authRouter.get('/register', (req, res) => {
  res.render('register')
})

authRouter.post('/register', async (req, res) => {
  try {
    const { name, username, user_type, password } = req.body
    joining_date = Date.now()
    const user = new User({ name, user_type, joining_date, username })
    const newuser = await User.register(user, password)
    req.login(newuser, (err) => {
      if (err) return next(err)
      req.flash('success', 'Welcome new user!')
      res.redirect('/welcome')
    })
  } catch (e) {
    req.flash('error', e.message)
    res.redirect('register')
  }
})

module.exports = authRouter
