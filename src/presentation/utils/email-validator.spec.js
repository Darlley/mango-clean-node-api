const validator = require('validator') // jest substitiu pelo __mock__/validator.js

class EmailValidator {
  isValid (email) {
    this.email = email
    return validator.isEmail(email)
  }
}
describe('Email Validator', () => {
  it('should return true if validator return true', () => {
    const sut = new EmailValidator()
    const isEmailValid = sut.isValid('valid_example@mail.com')
    expect(isEmailValid).toBe(true)
  })

  it('should return false if validator return false', () => {
    validator.isEmailValid = false
    const sut = new EmailValidator()
    const isEmailValid = sut.isValid('invalid@email.co')
    expect(isEmailValid).toBe(false)
  })
})
