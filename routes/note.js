const express = require('express')
const router = express.Router()
const protectRoute = require('../service/protectRoute.js')
const User = require('../models/user.js')
const moment = require('moment');

router.post('/',protectRoute, async (req, res) => {
  const currentUser = req.user
  const { content } = req.body;
  const user = await User.findById(currentUser._id);
  
  if (user) {
    user.note = {
      content,
      createdAt: Date.now(),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000 
    };
    await user.save();
  }
  const referer = req.headers.referer || `/${currentUser.username}`;
  res.redirect(referer);
});


// Function to clear expired notes (runs periodically)
const clearExpiredNotes = async () => {
  const currentTime = Date.now();
  try {
    await User.updateMany(
      { 'note.expiresAt': { $lte: currentTime } },
      { 
        $set: { 
          'note.content': '',
          'note.createdAt': null,
          'note.expiresAt': null 
        }
      }
    );
    console.log('Expired notes cleared successfully');
  } catch (err) {
    console.error('Error clearing expired notes:', err);
  }
};
setInterval(clearExpiredNotes, 3600000); 


router.post('/delete',protectRoute, async (req, res) => {
 const currentUser = req.user
 const user = await User.findById(currentUser._id)
 if(user) {
   user.note = {
      content: '',
      createdAt: null,
      expiresAt: null, 
   };
   await user.save();
 }
 
 const referer = req.headers.referer || `/${currentUser.username}`;
 res.redirect(referer);
})

module.exports = router;