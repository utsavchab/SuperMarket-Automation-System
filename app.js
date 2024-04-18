const express = require('express')

const path = require('path')
const ejsMate = require('ejs-mate')
const session = require('express-session')

const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')

const User = require('./models/user')

const authRouter = require('./routers/auth.router')
const profileRouter = require('./routers/profile.router')
const userRouter = require('./routers/user.router')
const inventoryRouter = require('./routers/inventory')
const morgan = require('morgan')
const { sessionConfig } = require('./config')

const app = express()
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.set('public', path.join(__dirname, 'node_modules'))

app.use(morgan('dev'))
app.use(express.urlencoded({ extended: true }))

app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
  res.locals.currentUser = req.user
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  next()
})

app.get('/', (req, res) => {
  res.render('login')
})

app.use(authRouter)
app.use(userRouter)
app.use(profileRouter)
app.use(inventoryRouter)

module.exports = app
