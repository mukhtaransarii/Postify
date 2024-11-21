require('dotenv').config();
const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const { updateToken } = require('../service/auth.js');

// Cloudinary setup
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Set up Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Set up Multer storage with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads',  // Optional, set a folder in Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg'],  // Allowed file formats
  },
});

const upload = multer({ storage: storage });

// Render Update Profile EJS
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ _id: id });
  res.render('profileUpdate', { user });
});

// Patch: Update profile picture and other data
router.patch('/:id', upload.single('pfp'), async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const existingToken = req.cookies.token;

  const user = await User.findOne({ _id: id });
  if (req.file) {
    // If file uploaded, save the Cloudinary URL
    updates.pfp = req.file.path;
  }

  const updatedUser = await User.findOneAndUpdate(
    { _id: id },
    { $set: updates },
    { new: true, runValidators: true }
  );

  const newToken = updateToken(updatedUser, existingToken);
  res.cookie('token', newToken, { httpOnly: true, secure: true, maxAge: 1000 * 60 * 60 * 24 * 365 * 10 });

  res.redirect(`/${updatedUser.username}`);
});

module.exports = router;
