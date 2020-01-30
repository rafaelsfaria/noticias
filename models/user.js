const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  username: {
    type: String
  },
  password: {
    type: String
  },
  name: String,
  facebookId: String,
  googleId: String,
  roles: {
    type: [String],
    default: ['restrict'],
    enum: ['admin', 'restrict']
  }
})

UserSchema.pre('save', function(next) {
  const user = this
  if (!user.isModified('password')) {
    return next()
  }
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.password, salt, (err, hash) => {
      user.password = hash
      return next()
    })
  })
})

UserSchema.methods.verifyPassword = function(password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, success) => {
      if (err) {
        reject(err)
      } else {
        resolve(success)
      }
    })
  })
}

const User = mongoose.model('User', UserSchema)

module.exports = User