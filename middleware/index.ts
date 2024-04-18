import { Request, Response, NextFunction } from 'express'

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    req.flash('error', 'You must be logged in')
    return res.redirect('/login')
  }
  next()
}
