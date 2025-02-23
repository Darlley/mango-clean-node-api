const LoginRouter = require('../../presentation/routers/LoginRouter')
const AuthUseCase = require('../../domain/usecases/auth-usecase')
const EmailValidator = require('../../utils/helpers/EmailValidator')
const LoadUserByEmailRepository = require('../../infra/repositories/load-user-by-email-repository')
const UpdateAccessTokenRepository = require('../../infra/repositories/update-access-token-repository')
const Encrypter = require('../../utils/helpers/Encrypter')
const TokenGenerator = require('../../utils/helpers/TokenGenerator')
const env = require('../config/env')

class LoginRouterComposer {
  static compose () {
    const tokenGenerator = new TokenGenerator(env.TOKEN_SECRET)
    const encrypter = new Encrypter()
    const loadUserByEmailRepository = new LoadUserByEmailRepository()
    const updateAccessTokenRepository = new UpdateAccessTokenRepository()
    const emailValidator = new EmailValidator()
    const authUseCase = new AuthUseCase({
      loadUserByEmailRepository,
      updateAccessTokenRepository,
      encrypter,
      tokenGenerator
    })

    return new LoginRouter({
      authUseCase,
      emailValidator
    })
  }
}

module.exports = LoginRouterComposer
