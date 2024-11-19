const express = require('express')
const app = express();
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const methodOverride = require('method-override');
const protectRoute = require('./service/protectRoute.js')
require('dotenv').config()

const staticRoute = require('./routes/static.js')
const profileUpdateRoute = require('./routes/profileUpdate.js')
const settingsRoute = require('./routes/settings.js')
const logoutRoute = require('./routes/logout.js')
const addPostRoute = require('./routes/addPost.js')
const deletePostRoute = require('./routes/deletePost.js')
const likeAndCommentRoute = require('./routes/likeAndComment.js')
const commentDeleteRoute = require('./routes/commentDelete.js')
const verifyBlueTickRoute = require('./routes/verifyBlueTick.js')
const followRoute = require('./routes/Follow.js')
const updateModelRoute = require('./routes/UpdateModel.js')
const searchAllUserRoute = require('./routes/searchAllUser.js')
const noteRoute = require('./routes/note.js')
const passwordChangeRoute = require('./routes/passwordChange.js')

//database connection code
mongoose.connect(process.env.db)
.then(() => console.log('MONGOOSE CONNECTED'))
.catch((e) => console.log('db connection errro : ',e))

// Middlewares
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())
app.use(methodOverride('_method'))


// Routes
app.use('/lc', likeAndCommentRoute)
app.use('/delete', commentDeleteRoute)
app.use('/verify', verifyBlueTickRoute)
app.use('/follow', followRoute)
app.use('/updateModel', updateModelRoute)

// Dynamic Route
app.use('/', staticRoute)
app.use('/:username/update', protectRoute, (req, res, next) => {
  const { username } = req.params;
  if (req.user.username !== username) return res.send('Unauthorized access')
  next();
}, profileUpdateRoute);

app.use('/:username/settings', protectRoute, (req, res, next) => {
  const { username } = req.params;
  if (req.user.username !== username) return res.send('Unauthorized access')
  next();
}, settingsRoute);

app.use('/:username/logout', protectRoute, (req, res, next) => {
  const { username } = req.params;
  if (req.user.username !== username) return res.send('Unauthorized access')
  next();
}, logoutRoute);

app.use('/:username/add-post', protectRoute, (req, res, next) => {
  const { username } = req.params;
  if (req.user.username !== username) return res.send('Unauthorized access')
  next();
}, addPostRoute);

app.use('/:username/delete', protectRoute, (req, res, next) => {
  const { username } = req.params;
  if (req.user.username !== username) return res.send('Unauthorized access')
  next();
}, deletePostRoute);

app.use('/:username/search', protectRoute, (req, res, next) => {
  const { username } = req.params;
  if (req.user.username !== username) return res.send('Unauthorized access')
  next();
}, searchAllUserRoute);

app.use('/:username/note', protectRoute, (req, res, next) => {
  const { username } = req.params;
  if (req.user.username !== username) return res.send('Unauthorized access')
  next();
}, noteRoute);

app.use('/:username/password-change', protectRoute, (req, res, next) => {
  const { username } = req.params;
  if (req.user.username !== username) return res.send('Unauthorized access')
  next();
}, passwordChangeRoute);


app.listen(3000, () => console.log('Server is running on PORT : 3000'))