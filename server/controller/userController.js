const User = require('../models/User')
const sendTokenUser = require('../utils/jwtToken')
const sendEmail = require('../utils/sendEmail')
const { OAuth2Client } = require('google-auth-library')
const CLIENT_ID =
  '619709385260-6olepqg4hu4h2pf39petabe1t5qg58fs.apps.googleusercontent.com'
const client = new OAuth2Client(CLIENT_ID)
const { v4: uuidv4 } = require('uuid')

module.exports.profileUpload = async (req, res) => {
  try {
    const url = req.protocol + '://' + req.get('host')
    const profileImg = url + '/uploads/' + req.file.filename
    console.log(req.file.filename)

    const user = await User.findById(req.user._id)

    user.avatar.url = profileImg
    await user.save()

    return res.status(200).json({
      success: true,
      data: user,
    })
  } catch (err) {
    console.log(err)
    return res.status(400).json({
      message: 'Internal server error',
    })
  }
}

module.exports.coverUpload = async (req, res) => {
  try {
    const url = req.protocol + '://' + req.get('host')
    const profileImg = url + '/uploads/' + req.file.filename
    console.log(req.file.filename)

    const user = await User.findById(req.user._id)

    user.cover.url = profileImg
    await user.save()

    return res.status(200).json({
      success: true,
      data: user,
    })
  } catch (err) {
    console.log(err)
    return res.status(400).json({
      message: 'Internal server error',
    })
  }
}

module.exports.googleSignup = async (req, res) => {
  try {
    let body = req.body
    const token = body.token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    })

    const { given_name, family_name, email, picture } = ticket.getPayload()
    let user = await User.findOne({ email: email })
    if (user) {
      await sendTokenUser(user, 200, res)
    } else {
      const uid = uuidv4()
      const username = given_name + '_' + family_name + uid
      user = await User.create({
        email,
        firstname: given_name,
        lastname: family_name,
        username,
        verified: true,
        password: token,
      })
      user.avatar.url = picture
      await user.save()
      await sendTokenUser(user, 200, res)
    }
  } catch (err) {
    console.log(err)
    return res.status(400).json({
      message: 'Internal server error',
    })
  }
}

module.exports.signupEmail = async (req, res) => {
  try {
    const user1 = await User.findOne({ email: req.body.email })
    const user2 = await User.findOne({ username: req.body.username })
    if (user2) {
      return res.status(400).json({
        message: 'user already exist with this username',
        type: 'userName',
        success: false,
      })
    }
    if (user1) {
      return res.status(400).json({
        error: 'user already exist with this email',
        type: 'email',
        success: false,
      })
    }

    const newUser = await User.create(req.body)
    const verificationToken = newUser._id
    const verificationUrl = `http://localhost:3000/verification/${verificationToken}`
    const message = `Your email verification token is as follow:\n\n${verificationUrl}\n\nIf you have not requested this email, then ignore it.`

    await sendEmail({
      email: newUser.email,
      subject: 'verification',
      message,
    })

    res.status(200).json({
      success: true,
      message: `Email sent to: ${newUser.email}`,
    })
  } catch (err) {
    console.log(err)
    return res.status(400).json({
      message: 'Internal server error',
    })
  }
}

module.exports.verify = async (req, res) => {
  try {
    const user = await User.findById(req.query.id)
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'user not found',
      })
    }

    user.verified = true
    await user.save()
    return res.status(200).json({
      success: true,
    })
  } catch (err) {
    console.log(err)
    return res.status(400).json({
      message: 'Internal server error',
    })
  }
}

module.exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
      return res.status(400).json({
        error: 'user already exist with this email',
        success: false,
      })
    }

    if (!user.verified) {
      return res.status(400).json({
        message: 'Email not verified',
        verified: false,
        success: false,
      })
    }

    if (user.password === req.body.password) {
      await sendTokenUser(user, 200, res)
    } else {
      return res.status(404).json({
        message: 'wrong password entered',
        success: false,
      })
    }
  } catch (err) {
    console.log(err)
    return res.status(400).json({
      message: 'Internal server error',
    })
  }
}

module.exports.getDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    return res.status(200).json({
      success: true,
      data: user,
    })
  } catch (err) {
    console.log(err)
    return res.status(400).json({
      message: 'Internal server error',
    })
  }
}

module.exports.update = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
    })
    return res.status(200).json({
      success: true,
      data: user,
    })
  } catch (err) {
    console.log(err)
    return res.status(400).json({
      message: 'Internal server error',
    })
  }
}

module.exports.logout = async (req, res) => {
  try {
    res.cookie('intern', null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })

    return res.status(200).json({
      message: 'signout success',
    })
  } catch (error) {
    console.log(error)
    return
  }
}
