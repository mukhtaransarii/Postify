const express = require('express')
const router = express.Router()
const User = require('../models/user.js')
const protectRoute = require('../service/protectRoute.js')


// Follow/Unfollow Route
router.post('/:username', protectRoute, async (req, res) => {
  
  const currentUser = await User.findById(req.user._id);
  const secondUser = await User.findOne({ username: req.params.username });

  const isFollowing = currentUser.following.includes(secondUser._id);
  let message;

  if (isFollowing) {
    // Unfollow logic
    currentUser.following.pull(secondUser._id);
    secondUser.followers.pull(currentUser._id);
    message = false;
  } else {
    // Follow logic
    currentUser.following.push(secondUser._id);
    secondUser.followers.push(currentUser._id);
    message = true;
  }

  // Save both users
  await currentUser.save();
  await secondUser.save();
  
  const isFollowedBack = secondUser.following.includes(currentUser._id);

  // Return updated followers and following counts
  res.status(200).json({
    message,
    followersCount: secondUser.followers.length,
    followingCount: currentUser.following.length,
    isFollowedBack,
  });

});

// Remove followers from followersStats
router.post('/:id/remove-follower',protectRoute, async (req, res) => {
  const currentUser = await User.findById(req.user._id);
  const secondUser = await User.findOne({ _id: req.params.id });

  
  currentUser.followers.pull(req.params.id)
  secondUser.following.pull(currentUser._id);
  await currentUser.save();
  await secondUser.save();
  
  const referer = req.headers.referer || '/';
  res.redirect(referer);
})

// Remove following from followingStats
router.post('/:id/remove-following',protectRoute, async (req, res) => {
  const currentUser = await User.findById(req.user._id);
  const secondUser = await User.findOne({ _id: req.params.id });

  
  currentUser.following.pull(req.params.id)
  secondUser.followers.pull(currentUser._id);
  await currentUser.save();
  await secondUser.save();
  
  const referer = req.headers.referer || '/';
  res.redirect(referer);
})


module.exports = router