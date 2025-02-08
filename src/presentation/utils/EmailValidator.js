const validator = require('validator') // jest substitiu pelo __mock__/validator.js

class EmailValidator {
  isValid (email) {
    this.email = email
    return validator.isEmail(email)
  }
}

module.exports = EmailValidator
