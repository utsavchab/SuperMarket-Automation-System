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

    res.render('sales_stat', {
      allsales,
      allDetails,
      allsalesforpie,
      filter: 'All Products Statistics',
    })
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
})

statsRouter.post('/stat', isLoggedIn, async (req: Request, res: Response) => {
  let filter = req.body.filter
  const start = new Date(req.body.start)
  const end = new Date(req.body.end)

  if (start > end) {
    req.flash('error', 'Start date cannot be greater than end date')
    return res.redirect('/stat')
  }

  try {
    let aggregationPipeline = []
    let matchObject = {}
    if (filter != 0) {
      matchObject = { item_code: filter }
    }
    if (start && end) {
      aggregationPipeline.push({
        $match: {
          // Assuming the date field in your Sales collection is named 'date'
          ...matchObject,
          date: {
            $gte: start, // Start date
            $lte: end, // End date
          },
        },
      })
    }
    aggregationPipeline.push(
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
      }
    )

    const allsalesforpie = await Sales.aggregate(aggregationPipeline)

    const allsales = await Sales.find({})
    const allDetails = await Item.find({})
    if (filter != 0) {
      const itemData = await Item.find({ item_code: filter })
      filter = `${itemData[0].item_name} Statistics`
      console.log()
      res.render('sales_stat', {
        allsales,
        allDetails,
        allsalesforpie,
        filter,
        start,
        end,
      })
    } else {
      res.render('sales_stat', {
        allsales,
        allDetails,
        allsalesforpie,
        filter: 'All Products Statistics',
        start,
        end,
      })
    }
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
})

export default statsRouter
