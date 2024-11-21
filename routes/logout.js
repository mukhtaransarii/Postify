const express = require('express')
const router = express.Router()

// logout
router.get('/', (req, res) => {
  res.clearCookie('token', { 
    httpOnly: true, 
    secure: true, 
    path: '/'
  });
  const referer = req.headers.referer || '/login';
  res.redirect(referer); 
});

module.exports = router