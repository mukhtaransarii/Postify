const express = require('express')
const router = express.Router()
const Post = require('../models/post.js')
const protectRoute = require('../service/protectRoute.js')

const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Set up Multer storage
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    
    const uploadPath = path.join(__dirname, '../public/uploads', req.user.username);

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});
const upload = multer({ storage });



// Post
router.get('/',protectRoute, (req, res) => {
  const currentUser = req.user
  res.render('addPost',{currentUser})
})

// Post Creating
router.post('/',protectRoute, upload.single('imageUrl'), async (req, res) => {
  let {title, imageUrl, createdBy} = req.body
  
  if (req.file)  imageUrl = `/uploads/${req.user.username}/${req.file.filename}`
  
  await Post.create({title, imageUrl, createdBy: req.user._id})
  res.redirect(`/${req.user.username}`)
});

module.exports = router