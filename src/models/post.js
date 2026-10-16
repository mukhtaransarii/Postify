const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
  title:{
    type: String,
  },
  imageUrl:{
    type: String,
    default: ''
  },
  createdBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId], // Array of user IDs who liked the post
    default: []
  },
  comments: [
    {
      text: String,
      commentedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
}, {timestamps: true})

const Post = mongoose.model('post', postSchema)
module.exports = Post;