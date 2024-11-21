const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
  sender: {
    type: String,
    required: true 
  },
  receiver: {
    type: String, 
    required: true 
  },
  message: {
    type: String,
    required: true 
  },
}, {timestamps: true});

const Message = mongoose.model('message', messageSchema);
module.exports = Message;