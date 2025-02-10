const { MissingParamError } = require('../../utils/errors')

class AuthUseCaseSpy {
  async auth (email) {
    if (!email) {
      throw new MissingParamError('email')
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
})
