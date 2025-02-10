const { MissingParamError } = require('../../utils/errors')

class AuthUseCaseSpy {
  async auth (email, password) {
    if (!email) {
      throw new MissingParamError('email')
    }
    if (!password) {
      throw new MissingParamError('password')
    }
  }
}

describe('Auth UseCase', () => {
  it('should throw if no email is provided', async () => {
    // Arrange
    const sut = new AuthUseCaseSpy()
    const promise = sut.auth()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })
  
  it('should throw if no password is provided', async () => {
    // Arrange
    const sut = new AuthUseCaseSpy()
    const promise = sut.auth('any_example@mail.com')
    expect(promise).rejects.toThrow(new MissingParamError('password'))
  })
})
