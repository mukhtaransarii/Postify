const express = require('express')
const router = express.Router()
const protectRoute = require('../service/protectRoute.js')
const Post = require('../models/post.js')
const User = require('../models/user');
const moment = require('moment');

// Add likes
router.post('/like/:postId/:userId', async (req, res) => {
    const { postId, userId } = req.params;
    const post = await Post.findById(postId);
    
    let isLiked
    if (post.likes.includes(userId)) {
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      isLiked = false;
    } else {
      await Post.updateOne({ _id: postId }, { $addToSet: { likes: userId } });
      isLiked = true;
    }
    const updatedPost = await Post.findById(postId);
    res.status(200).json({ likes: updatedPost.likes.length, isLiked});
})


// Comment route
router.post('/comment/:userId/:postId', async (req, res) => {
  const { postId, userId } = req.params;
  const { text } = req.body;
  const post = await Post.findById(postId);

  post.comments.push({ text, commentedBy: userId });
  await post.save();

  const populatedPost = await Post.findById(postId).populate('comments.commentedBy', 'username pfp isVerified');
  const savedComment = populatedPost.comments[populatedPost.comments.length - 1];
  
  const commentsCount = post.comments.length; 

  res.status(200).json({comment: savedComment, commentsCount});
});





module.exports = router;
