require('dotenv').config();  // Load environment variables from .env file
const express = require('express');
const router = express.Router();
const Post = require('../models/post.js');
const protectRoute = require('../service/protectRoute.js');

const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Cloudinary setup
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up Multer storage with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads',  // Optional: Set a folder in Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg'],  // Allowed file formats
  },
});
const upload = multer({ storage: storage });

// Post
router.get('/', protectRoute, (req, res) => {
  const currentUser = req.user;
  res.render('addPost', { currentUser });
});

// Post Creating
router.post('/', protectRoute, upload.single('imageUrl'), async (req, res) => {
  let { title, imageUrl, createdBy } = req.body;

  if (req.file) {
    // Use Cloudinary URL for the uploaded image
    imageUrl = req.file.path;
  }

  // Create a new post in the database
  await Post.create({ title, imageUrl, createdBy: req.user._id });

  res.redirect(`/${req.user.username}`);
});

module.exports = router;
