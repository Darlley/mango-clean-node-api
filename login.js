const express = require('express')
const router = express.Router()

module.exports = () => {
  return router.post('/signup', ExpressAdapter.adapt(new SignUpRouter()))
}

// pattern-adapter
class ExpressAdapter {
  static adapt (router) {
    return async (req, resp) => {
      const httpRequest = {
        body: req.body
      }
      const httpResponse = router.route(httpRequest)
      resp.status(httpResponse.statusCode).json(httpResponse.body)
    }
  }
}

// Presentation layer
// signup-router
class SignUpRouter {
  async route (httpRequest, httpResponse) {
    const { email, password, repeatPassword } = httpRequest.body

    const user = new SignUpUseCase().signUp(email, password, repeatPassword)
    if (!user) {
      return httpResponse
        .status(400)
        .json({ error: 'password must be equal to repeatPassword' })
    }

    return {
      statusCode: 200,
      body: user
    }
  }
}

// Domain layer
// signup-usecase
class SignUpUseCase {
  async signUp (email, password, repeatPassword) {
    if (password === repeatPassword) {
      new AddAccountRepository().add(email, password)
    }
  }
}

// Infra
// add-account-repo
const mongoose = require('mongoose')
const AccountModel = mongoose.model('Account')

class AddAccountRepository {
  async add (email, password) {
    const user = await AccountModel.create({ email, password })
    return user
  }
}
