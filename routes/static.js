const express = require('express')
const router = express.Router()
const User = require('../models/user.js')
const Post = require('../models/post.js')
const protectRoute = require('../service/protectRoute.js')
const moment = require('moment');
const { validateToken } = require('../service/auth.js')

// Home Route
router.get('/',protectRoute, async (req, res) => {

  
  const currentUser = await User.findOne({_id: req.user._id})
  let post = await Post.find({ createdBy: { $in: currentUser.following } })
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order
      .populate('createdBy', 'username pfp name isVerified _id')
      .populate('comments.commentedBy', 'username pfp name isVerified _id')
      .lean();
  

  post.forEach(post => {
    post.createdAtFormatted = moment(post.createdAt).fromNow();
  
    post.comments.forEach(comment => {
      comment.createdAtFormatted = moment(comment.createdAt).fromNow();
    });
  });

  res.render('home', {currentUser, post})
})

// Singup Here
router.get('/signup', async (req, res) => {
  const token = req.cookies.token;

  if (token) {
    const tokenUser = validateToken(token); 
    return res.redirect(`/${tokenUser.username}`);
  }
  res.render('signup');
});

router.post('/signup', async (req, res) => {
  const {name, username, bio, pfp, email, password} = req.body
  
  // Check if the email or username already exists before creating the user
  const emailExists = await User.findOne({ email });
  const usernameExists = await User.findOne({ username });

  if (emailExists || usernameExists) {
    return res.render('signup', {
      error: emailExists ? 'Email is already taken' : 'Username is already taken'
    });
  }
  
  await User.create({name, username, bio, pfp, email, password})
  res.redirect('/success')
})

// Email or Username Check if Exist throw error on UI
router.post('/check-availability', async (req, res) => {
  const { email, username } = req.body;
  const emailExists = email ? await User.findOne({ email }) : null;
  const usernameExists = username ? await User.findOne({ username }) : null;
  res.json({ emailExists: !!emailExists, usernameExists: !!usernameExists });
});






//Login Here
router.get('/login', (req, res) => {
  const token = req.cookies.token;

  if (token) {
    const tokenUser = validateToken(token); 
    return res.redirect(`/${tokenUser.username}`);
  }
  res.render('login', {error: ''})
})

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const token = await User.mathPasswordAndCreateToken(username, password);

  if (!token) return res.status(401).render('login', { error: 'Invalid username or password' });

  res.cookie('token', token, {
    maxAge: Date.now() + 3600000, 
    httpOnly: true, 
  }).redirect(`/${username}`);
});



// Profile
router.get('/:username', protectRoute, async (req, res) => {
  const user = await User.findOne({ username: req.params.username })
  if (!user) return res.status(404).send('Cannot GET /' + req.params.username)
  const currentUser = req.user
  
  let post = await Post.find({createdBy: user._id})
  .populate('comments.commentedBy', 'username pfp isVerified') 
  .exec();
  post = post.reverse()
  post.forEach(post => {
    post.createdAtFormatted = moment(post.createdAt).fromNow(); 

    post.comments.forEach(comment => {
        comment.createdAtFormatted = moment(comment.createdAt).fromNow();
    });
  });
  const createdAt = user.note.createdAt;
  const createdAtFormatted = moment(createdAt).fromNow();

  const isFollowing = user.followers.includes(currentUser._id);
  const isFollowedBack = user.following.includes(currentUser._id);

  res.render('profile', {user, currentUser, post, isFollowing, isFollowedBack, createdAtFormatted});
});




// All Followers Stats
router.get('/:username/followers',protectRoute, async (req, res) => {
 const currentUser = req.user
  const user = await User.findOne({ username: req.params.username })
      .populate('followers')
      .populate('_id')
  const { followers, _id } = user;

  res.render('followersStats', { followers, _id, currentUser, user})
})

// All Following Stats
router.get('/:username/following',protectRoute, async (req, res) => {
 const currentUser = req.user
  const user = await User.findOne({ username: req.params.username })
      .populate('following')
      .populate('_id')
  const { following, _id } = user;

  res.render('followingStats', { following, _id, currentUser, user})
})



module.exports = router;