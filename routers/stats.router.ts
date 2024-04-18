import express, { Request, Response } from 'express'
import { isLoggedIn } from '../middleware'
import Sales from '../models/sales'
import Item from '../models/item'

const statsRouter = express.Router()

statsRouter.get('/stat', isLoggedIn, async (req: Request, res: Response) => {
  if (res.locals.currentUser.user_type !== 'Manager') {
    req.flash('error', 'Only Manager is authorized for this action')
    return res.redirect('/welcome')
  }
  try {
    const allsalesforpie = await Sales.aggregate([
      {
        $match: {},
      },
      {
        $group: {
          _id: '$item_name',
          total: {
            $sum: { $multiply: ['$quantity', '$unit_price'] },
          },
        },
      },
      {
        $addFields: {
          item_name: '$_id',
        },
      },
    ])
    const allsales = await Sales.find({})
    const allDetails = await Item.find({})
    const filter = 0
    res.render('sales_stat', { allsales, allDetails, allsalesforpie, filter })
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
})

statsRouter.post('/stat', isLoggedIn, async (req: Request, res: Response) => {
  const filter = req.body.filter
  try {
    const allsalesforpie = await Sales.aggregate([
      {
        $match: {},
      },
      {
        $group: {
          _id: '$item_name',
          total: {
            $sum: { $multiply: ['$quantity', '$unit_price'] },
          },
        },
      },
      {
        $addFields: {
          item_name: '$_id',
        },
      },
    ])
    const allsales = await Sales.find({})
    const allDetails = await Item.find({})
    res.render('sales_stat', { allsales, allDetails, allsalesforpie, filter })
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
})

export default statsRouter
