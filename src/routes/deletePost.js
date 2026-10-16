const express = require('express');
const router = express.Router();
const Post = require('../models/post.js');
const protectRoute = require('../service/protectRoute.js');

router.post('/:id', protectRoute, async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
 
    const currentUser = req.user;
    res.redirect(`/${currentUser.username}`);
});

module.exports = router;
