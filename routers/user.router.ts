import express, { Request, Response } from 'express'
import { isLoggedIn } from '../middleware'
import Item from '../models/item'
import Sales from '../models/sales'
import Bill from '../models/bill'
import statsRouter from './stats.router'

const userRouter = express.Router()

userRouter.use(statsRouter)

userRouter.get('/bill', isLoggedIn, async (req: Request, res: Response) => {
  if (res.locals.currentUser.user_type !== 'Clerk') {
    req.flash('error', 'Only Sales Clerk is authorized for this action')
    return res.redirect('/welcome')
  }
  try {
    const items = await Item.find({})
    res.render('bill', { items })
  } catch (error) {
    console.error('Error fetching items:', error)
    res.status(500).send('Internal Server Error')
  }
})

userRouter.post('/bill', isLoggedIn, async (req: Request, res: Response) => {
  if (res.locals.currentUser.user_type !== 'Clerk') {
    req.flash('error', 'Only Sales Clerk is authorized for this action')
    return res.redirect('/welcome')
  }
  try {
    const bill = req.body
    const date = new Date()
    bill.date = date
    const bill_items = []

    for (let i = 0; i < bill.code.length; i++) {
      const q = await Item.find({ item_code: bill.code[i] })
      const x = await Item.findOneAndUpdate(
        { item_code: bill.code[i] },
        { quantity: q[0].quantity - bill.qty[i] }
      )
      bill_items.push({
        item_code: bill.code[i],
        name: q[0].item_name,
        quantity: bill.qty[i],
        unit_price: bill.price[i],
      })
      const sell = new Sales({
        item_code: bill.code[i],
        item_name: q[0].item_name,
        unit_price: bill.price[i],
        quantity: bill.qty[i],
        date: date,
      })
      await sell.save()
    }

    const new_bill = new Bill({
      items: bill_items,
      total_cost: bill.sub_total,
      date: bill.date,
    })
    await new_bill.save()

    bill.id = await Bill.countDocuments()
    bill.bill_items = bill_items
    res.render('print_bill', { bill })
  } catch (error) {
    console.error('Error processing bill:', error)
    res.status(500).send('Internal Server Error')
  }
})

userRouter.get('/print', isLoggedIn, (req: Request, res: Response) => {
  if (res.locals.currentUser.user_type !== 'Clerk') {
    req.flash('error', 'Only Sales Clerk is authorized for this action')
    return res.redirect('/welcome')
  }
  res.render('print_bill')
})

export default userRouter
