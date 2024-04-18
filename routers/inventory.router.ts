import express, { Request, Response } from 'express'
import { isLoggedIn } from '../middleware'
import Item, { ItemDocument } from '../models/item'

const inventoryRouter = express.Router()

inventoryRouter.get(
  '/inventory',
  isLoggedIn,
  async (req: Request, res: Response) => {
    if (res.locals.currentUser.user_type === 'Clerk') {
      req.flash('error', 'You are not authorized for this action')
      return res.redirect('/welcome')
    }
    try {
      const allDetails: ItemDocument[] = await Item.find({})
      console.log(allDetails)
      res.render('inventory', { details: allDetails })
    } catch (error) {
      console.error('Error fetching inventory:', error)
      res.status(500).send('Internal Server Error')
    }
  }
)

inventoryRouter.post(
  '/add',
  isLoggedIn,
  async (req: Request, res: Response) => {
    const newitem = req.body
    try {
      const item = new Item({
        item_name: newitem.i1,
        item_code: (await Item.countDocuments()) + 1,
        quantity: newitem.i4,
        unit_price: newitem.i3,
        description: newitem.i2,
      })
      await item.save()
      const allDetails: ItemDocument[] = await Item.find({})
      res.render('inventory', { details: allDetails })
    } catch (error) {
      console.error('Error adding item:', error)
      res.status(500).send('Internal Server Error')
    }
  }
)

inventoryRouter.post(
  '/updateItems',
  isLoggedIn,
  async (req: Request, res: Response) => {
    const newitem = req.body
    try {
      const x = await Item.findOneAndUpdate(
        { item_code: parseInt(newitem.i1) },
        { unit_price: newitem.i3, quantity: newitem.i4 }
      )
      const allDetails: ItemDocument[] = await Item.find({})
      res.render('inventory', { details: allDetails })
    } catch (error) {
      console.error('Error updating item:', error)
      res.status(500).send('Internal Server Error')
    }
  }
)

export default inventoryRouter
