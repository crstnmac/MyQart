const { User } = require('../models/user')
const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const secret = process.env.SECRET_KEY

router.get(`/`, async (req, res) => {
  const userList = await User.find().select('-passwordHash')
  if (!userList) {
    res.status(500).json({ success: false })
  }
  res.send(userList)
})

router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id).select('-passwordHash')

  if (!user) {
    res.status(500).json({ success: false, message: 'User not found' })
  }
  res.status(200).send(user)
})

router.post(`/register`, async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    appartment: req.body.appartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  })

  user = await user.save()

  if (!user) {
    return res.status(404).send('the user cannot be created!')
  }

  res.send(user)
})

router.put('/:id', async (req, res) => {
  const userExist = await User.findById(req.params.id)
  let newPassword
  if (req.body.password) {
    newPassword = bcrypt.hashSync(req.body.password, secret)
  } else {
    newPassword = userExist.passwordHash
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      passwordHash: newPassword,
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      street: req.body.street,
      appartment: req.body.appartment,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country,
    },
    {
      new: true,
    }
  )

  if (!user) {
    return res.status(404).send('the user cannot be updated!')
  }

  res.send(user)
})

router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    return res.status(404).send('the user cannot be found!')
  }
  const isPasswordValid = bcrypt.compareSync(
    req.body.password,
    user.passwordHash
  )
  if (!isPasswordValid) {
    return res.status(401).send('invalid password')
  }
  const token = jwt.sign(
    {
      userId: user._id,
      isAdmin: user.isAdmin,
    },
    secret,
    {
      expiresIn: '1d',
    }
  )
  res.status(200).send({ user: user.email, token })
})

router.get(`/get/count`, async (req, res) => {
  const userCount = req.params.count ? req.params.count : 0
  const users = await User.countDocuments()
  if (!users) {
    res.status(500).json({ success: false })
  }
  res.send(users)
})

router.delete('/:id', (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then((user) => {
      if (user) {
        return res.status(200).json({
          success: true,
          message: 'The user has been deleted!',
        })
      } else {
        return res.status(404).json({
          success: false,
          message: 'The user cannot be found!',
        })
      }
    })
    .catch((err) => {
      return res.status(400).json({
        success: false,
        message: 'The user cannot be deleted!',
      })
    })
})

module.exports = router
