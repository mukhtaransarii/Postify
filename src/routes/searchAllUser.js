const express = require('express');
const router = express.Router();
const User = require('../models/user.js'); 
const protectRoute  = require('../service/protectRoute.js')

router.get('/',protectRoute, async (req, res) => {
  const totalUser = await User.find()
  res.render('searchAllUser', {currentUser: req.user, totalUser})
})

router.get('/results', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.json([]);
  
  const users = await User.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { username: { $regex: query, $options: 'i' } }
    ]
  }).limit(10); // Limit results if needed
  res.json(users);
});

module.exports = router;
