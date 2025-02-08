class EmailValidator {
  isValid (email) {
    this.email = email
    return true
  }
}
describe('Email Validator', () => {
  it('should  return true if validator return true', () => {
    const sut = new EmailValidator()
    const isEmailValid = sut.isValid('valid_example@mail.com')
    expect(isEmailValid).toBe(true)
  })
})
