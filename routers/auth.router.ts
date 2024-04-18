import express, { Request, Response, NextFunction } from 'express'
import passport from 'passport'
import { isLoggedIn } from '../middleware'
import User from '../models/user'

const authRouter = express.Router()

authRouter.get('/login', (req: Request, res: Response) => {
  res.render('login')
})

authRouter.post(
  '/login',
  passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login',
  }),
  async (req: Request, res: Response) => {
    req.flash('success', 'Welcome back!')
    res.redirect('/welcome')
  }
)

authRouter.get(
  '/logout',
  isLoggedIn,
  (req: Request, res: Response, next: NextFunction) => {
    req.logout({ keepSessionInfo: false }, (err) => {
      if (err) {
        console.error(err)
        req.flash('failed', 'Please try again')
      } else {
        req.flash('success', 'Goodbye!')
        res.redirect('/login')
      }
    })
  }
)

authRouter.get('/register', (req: Request, res: Response) => {
  res.render('register')
})

authRouter.post(
  '/register',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, username, user_type, password } = req.body
      const joining_date = new Date()
      const user = new User({ name, user_type, joining_date, username })
      const newuser = await User.register(user, password)
      req.login(newuser, (err) => {
        if (err) return next(err)
        req.flash('success', 'Welcome new user!')
        res.redirect('/welcome')
      })
    } catch (error: any) {
      req.flash('error', error.message)
      res.redirect('/register')
    }
  }
)

export default authRouter
