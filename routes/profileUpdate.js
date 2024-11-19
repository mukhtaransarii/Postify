const express = require('express')
const router = express.Router()
const User = require('../models/user.js')
const { updateToken } = require('../service/auth.js');

const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Set up Multer storage
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const user = await User.findOne({ _id: req.params.id });
    const username = user.username;

    const uploadPath = path.join(__dirname, '../public/uploads', username);

    // Create directory if it doesn't exist
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

// Render Update Profile EJS
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ _id: id });
  res.render('profileUpdate', { user });
});

// Patch : GETING UPDATE DATA FROM EJS AND UPDATE IT.
router.patch('/:id', upload.single('pfp'), async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const existingToken = req.cookies.token;

  const user = await User.findOne({ _id: id });
  if (req.file)  updates.pfp = `/uploads/${user.username}/${req.file.filename}`

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