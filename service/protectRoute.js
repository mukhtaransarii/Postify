const { validateToken } = require('./auth.js')

function protectRoute(req, res, next) {
  const tokenValue = req.cookies.token
  if(!tokenValue) return res.redirect('/login')
 
  try {
    const userPayload = validateToken(tokenValue)
    req.user = userPayload
    return next()
  } catch (e) {
    console.log('error from protectRoute.js : ', e)  
  }
}

module.exports = protectRoute;