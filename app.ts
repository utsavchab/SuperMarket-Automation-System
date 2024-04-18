import express from 'express'
import path from 'path'
import session from 'express-session'
import flash from 'connect-flash'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import User from './models/user'
import authRouter from './routers/auth.router'
import profileRouter from './routers/profile.router'
import userRouter from './routers/user.router'
import inventoryRouter from './routers/inventory.router'
import morgan from 'morgan'
import { sessionConfig } from './config'
// @ts-ignore
import ejsMate from 'ejs-mate'

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

passport.serializeUser((User as any).serializeUser())
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

export default app
