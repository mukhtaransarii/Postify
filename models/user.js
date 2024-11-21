const mongoose = require('mongoose');
const {randomBytes, createHmac} = require('crypto');
const { tokenCreate }  = require('../service/auth.js')

// Define the User schema
const userSchema = new mongoose.Schema({
    name: {
      type: String,
    },
    username: {
      type: String,
      unique: true,
    },
    isVerified:{
      type: Boolean,
      default: false,
    },
    bio:{
      type: String,
      default:''
    },
    phone:{
      type: Number,
      default: ''
    },
    pfp:{
      type: String,
      default: '/pfp/default_pfp.jpeg'
    },
    email: {
        type: String,
        unique: true,
    },
    salt:{
      type: String
    },
    password: {
        type: String,
    },
    followers: [
      { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user' 
      }
    ],
    following: [
      { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user' 
      }
    ],
    note:{
      content: String,
      expiresAt: {
        type: Date,
        default: null,
      },
      createdAt: {
        type: Date,
        default: null,
      }
    },
    messages: [
    
    ]

}, { timestamps: true });


// Hash the password before saving the user
userSchema.pre('save', function (next) {
    if (this.isModified('password')) {
      const salt = randomBytes(16).toString('hex')
       
      const hash = createHmac('sha256', salt)
      .update(this.password)
      .digest('hex')
       
      this.salt = salt;
      this.password = hash
    }
    next();
});

// Method to compare passwords
userSchema.static('mathPasswordAndCreateToken', async function(username, password){
  const user = await this.findOne({username});
  if(!user) return console.log('User not Found')
  
  const hash = createHmac('sha256', user.salt)
  .update(password)
  .digest('hex')
  
  if(hash !== user.password) return console.log('Password is incorrect')
 
  const token = tokenCreate(user)
  return token
})


const User = mongoose.model('user', userSchema);
module.exports = User;
