const express = require('express');
const router = express.Router();
const User = require('../models/user.js');

router.post('/:id', async (req, res) => {
  
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  user.isVerified = true;  
  await user.save();

  res.status(200).json({ message: 'User verified and username updated' });
});

module.exports = router;
