const app = require('express')
const { isLoggedIn } = require('../middleware')
const Sales = require('../models/sales')
const Item = require('../models/item')

const statsRouter = app.Router()

statsRouter.get('/stat', isLoggedIn, async (req, res) => {
  if (res.locals.currentUser.user_type != 'Manager') {
    req.flash('error', 'Only Manager is authorized for this action')
    res.redirect('/welcome')
  }
  var filter = 0
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
  } catch (err) {
    console.error(err)
    res.status(500).send('Internal Server Error')
  }
})

statsRouter.post('/stat', isLoggedIn, async (req, res) => {
  var filter = req.body.filter
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
  } catch (err) {
    console.error(err)
    res.status(500).send('Internal Server Error')
  }
})

module.exports = statsRouter
