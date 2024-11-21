const express = require('express')
const router = express.Router()
const protectRoute = require('../service/protectRoute.js')
require('dotenv').config()


router.get("/",protectRoute, (req, res) => {
  const currentUser = req.user
  res.render("requestVerify",{currentUser, smptKey: process.env.smptKey});
});

module.exports = router