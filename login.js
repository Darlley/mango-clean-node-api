// signup-router
const express = require('express')
const router = express.Router()

module.exports = () => {
  router.post('/signup', new SignUpRouter().route) // .route é um ponteiro que ja recebe no callback os parametros
}

class SignUpRouter {
  async route (req, res) {
    const { email, password, repeatPassword } = req.body
    new SignUpUseCase().signUp(email, password, repeatPassword)
    res.status(400).json({ error: 'password must be equal to repeatPassword' })
  }
}

// signup-usecase
class SignUpUseCase {
  async signUp (email, password, repeatPassword) {
    if (password === repeatPassword) {
      new AddAccountRepository().add(email, password)
    }
  }
}

// add-account-repo
const mongoose = require('mongoose')
const AccountModel = mongoose.model('Account')

class AddAccountRepository {
  async add (email, password) {
    const user = await AccountModel.create({ email, password })
    return user
  }
}
