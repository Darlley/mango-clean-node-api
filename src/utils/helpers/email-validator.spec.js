const validator = require('validator') // jest substitiu pelo __mock__/validator.js
const EmailValidator = require('./EmailValidator')
const { MissingParamError } = require('../errors')

const makeSut = () => {
  return new EmailValidator()
}

describe('Email Validator', () => {
  it('should return true if validator return true', () => {
    const sut = makeSut()
    const isEmailValid = sut.isValid('valid_example@mail.com')
    expect(isEmailValid).toBe(true)
  })

  it('should return false if validator return false', () => {
    validator.isEmailValid = false
    const sut = makeSut()
    const isEmailValid = sut.isValid('invalid email')
    expect(isEmailValid).toBe(false)
  })

  it('should return false if validator return false', () => {
    const sut = makeSut()
    const email = 'invalid email'
    sut.isValid(email)
    expect(sut.email).toBe(email)
  })

  it('should throw if no email is provided', async () => {
    const sut = makeSut()
    expect(() => { sut.isValid() }).toThrow(new MissingParamError('email'))
  })
})
