const express = require('express')
const router = express.Router()
const User = require('../models/user.js'); 
const protectRoute = require('../service/protectRoute.js')

router.get('/:username',protectRoute, async (req, res) => {
  const { username } = req.params
  const user = await User.findOne({username})
  
  res.render('message', {user})
})


module.exports = router;