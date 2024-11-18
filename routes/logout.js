const express = require('express')
const router = express.Router()

// logout
router.get('/', (req, res) => {
  res.clearCookie('token', { 
    httpOnly: true, 
    secure: true, 
    path: '/'
  });
  res.status(204).end(); 
});

module.exports = router