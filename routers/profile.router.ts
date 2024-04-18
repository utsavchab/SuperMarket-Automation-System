import express, { Request, Response } from 'express'
import { isLoggedIn } from '../middleware'

const profileRouter = express.Router()

profileRouter.get(
  '/profile',
  isLoggedIn,
  async (req: Request, res: Response) => {
    res.render('profile')
  }
)

profileRouter.get('/about', isLoggedIn, async (req: Request, res: Response) => {
  res.render('about')
})

profileRouter.get(
  '/welcome',
  isLoggedIn,
  async (req: Request, res: Response) => {
    res.render('welcome')
  }
)

export default profileRouter
