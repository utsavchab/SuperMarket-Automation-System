const app = require('express')
const profileRouter = app.Router()
const { isLoggedIn } = require('../middleware')

profileRouter.get('/profile', isLoggedIn, async (req, res) => {
  res.render('profile')
})

profileRouter.get('/about', isLoggedIn, async (req, res) => {
  res.render('about')
})

profileRouter.get('/welcome', isLoggedIn, async (req, res) => {
  res.render('welcome')
})

module.exports = profileRouter
