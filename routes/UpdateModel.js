const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.put('/', async (req, res) => {
  try {
    const users = await User.updateMany(
      { note: { $exists: false } },
      { $set: {
                note: {
                  content: '',
                  expiresAt: null,
                  createdAt: null,
                } 
              } 
      }
    )
    res.status(200).json({ message: 'Users updated successfully', updatedCount: users.modifiedCount });
  } catch (err) {
    res.status(500).json({ message: 'Error updating users', error: err.message });
  }
});

module.exports = router;
