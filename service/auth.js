const JWT = require('jsonwebtoken')
require('dotenv').config()
const secret = process.env.secret

function tokenCreate(user){
  const payload = {
    _id: user._id,
    name: user.name,
    bio: user.bio,
    pfp: user.pfp,
    username: user.username,
    email: user.email,
    following: user.following,
    followers: user.followers,
  }
  const token = JWT.sign(payload, secret)
  return token;
}

function validateToken(token){
  const payload = JWT.verify(token, secret)
  return payload;
}

function updateToken(user, existingToken) {
  try {
    // Decode the existing token to extract payload
    const oldPayload = validateToken(existingToken);

    // Create a new token with updated user information
    const newPayload = {
      ...oldPayload,
      name: user.name,
      bio: user.bio,
      pfp: user.pfp,
      username: user.username,
      email: user.email,
    };
    
    const newToken = JWT.sign(newPayload, secret);
    return newToken;
  } catch (err) {
    console.error('Error updating token:', err.message);
    throw new Error('Failed to update token');
  }
}

module.exports = {
  tokenCreate,
  validateToken,
  updateToken,
}