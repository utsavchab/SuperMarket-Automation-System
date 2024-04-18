const app = require('express')
const inventoryRouter = app.Router()
const { isLoggedIn } = require('../middleware')
const Item = require('../models/item')

inventoryRouter.get('/inventory', isLoggedIn, async (req, res) => {
  if (res.locals.currentUser.user_type == 'Clerk') {
    req.flash('error', 'You are not authorized for this action')
    res.redirect('/welcome')
  }
  const allDetails = await Item.find({})
  console.log(allDetails)
  res.render('inventory', { details: allDetails })
})

inventoryRouter.post('/add', isLoggedIn, async (req, res) => {
  newitem = req.body
  const item = new Item({
    item_name: newitem.i1,
    item_code: (await Item.countDocuments()) + 1,
    quantity: newitem.i4,
    unit_price: newitem.i3,
    description: newitem.i2,
  })
  await item.save()
  const allDetails = await Item.find({})
  res.render('inventory', { details: allDetails })
})

inventoryRouter.post('/updateItems', isLoggedIn, async (req, res) => {
  newitem = req.body
  const x = await Item.findOneAndUpdate(
    { item_code: parseInt(newitem.i1) },
    { unit_price: newitem.i3, quantity: newitem.i4 }
  )
  const allDetails = await Item.find({})
  res.render('inventory', { details: allDetails })
})

module.exports = inventoryRouter
