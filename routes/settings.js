const express = require('express')
const router = express.Router()
const protectRoute = require('../service/protectRoute.js')

router.get('/',protectRoute, (req, res) => {
  const currentUser = req.user
  res.render('settings', {currentUser})
})

module.exports = router;
