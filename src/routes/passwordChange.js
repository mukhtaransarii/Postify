const express = require('express');
const router = express.Router();
const User = require('../models/user');
const protectRoute = require('../service/protectRoute');
const { tokenCreate } = require('../service/auth.js')
const {randomBytes, createHmac} = require('crypto');


router.get('/', protectRoute, (req, res) => {
  const currentUser = req.user;
  let error;
  res.render('passwordChange', { currentUser, error });
});

// passwordChange function// Password change route (POST)
router.post('/', protectRoute, async (req, res) => {
  const currentUser = req.user;
  const username = currentUser.username;
  const { currentPassword, newPassword, confirmPassword } = req.body;

  try {
    // Step 1: Find the user by username
    const user = await User.findOne({ username });
    console.log('user found : ', user)
    if (!user) {
      return res.status(400).render('passwordChange', { error: 'User not found', currentUser });
    }

    // Step 2: Verify the current password
    const hash = createHmac('sha256', user.salt)
      .update(currentPassword)
      .digest('hex');

    if (hash !== user.password) {
      return res.status(400).render('passwordChange', { error: 'Current password is incorrect', currentUser });
    }

      // Step 3: Check if new password matches confirm password
    if (newPassword !== confirmPassword) {
      return res.status(400).render('passwordChange', { error: 'New passwords do not match', currentUser });
    }
    
    user.password = newPassword;
    await user.save();

    res.redirect(`/${username}?message=Password updated successfully`);
  } catch (err) {
    console.log('Error in password change route:', err);
    res.status(500).render('passwordChange', { error: 'An error occurred, please try again', currentUser });
  }
});



module.exports = router;
