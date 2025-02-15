const validator = require('validator') // jest substitiu pelo __mock__/validator.js
const { MissingParamError } = require('../errors')

class EmailValidator {
  isValid (email) {
    if (!email) throw new MissingParamError('email')

    this.email = email
    return validator.isEmail(email)
  }
}

module.exports = EmailValidator
