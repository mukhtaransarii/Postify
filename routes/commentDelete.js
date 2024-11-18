const express = require('express')
const router = express.Router()
const Post = require('../models/post.js')

// Comment Delete
router.post('/:id', async (req, res) => {
    const post = await Post.findOneAndUpdate(
      { 'comments._id': req.params.id },
      { $pull: { comments: { _id: req.params.id } } } 
    );
    const commentsCount = post.comments.length;
    
    res.status(200).json({ commentsCount });
});

module.exports = router;