const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
  username: {
    type: String,
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: [true, 'User already exists'],
  },
  password: {
    type: String,
    required: [true, 'Please enter your password'],
  },
  description: {
    type: String,
  },
  avatar: {
    url: {
      type: String,
      default:
        'https://res.cloudinary.com/djgvt8uo4/image/upload/v1621674024/users/user_vprxe7.png',
    },
  },
  cover: {
    url: {
      type: String,
      default:
        'https://res.cloudinary.com/djgvt8uo4/image/upload/v1622608984/cover6_nmxort.jpg',
    },
  },
  verified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

//return jwt
userSchema.methods.getJwtToken = function () {
  //can't use arrow function here
  return jwt.sign({ id: this._id }, 'secretKeY', {
    expiresIn: '7d',
  })
}

module.exports = mongoose.model('User', userSchema)
