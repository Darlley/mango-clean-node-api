const { MissingParamError } = require('../../utils/errors')

class AuthUseCaseSpy {
  constructor (loadUserByEmailRepository) {
    this.loadUserByEmailRepository = loadUserByEmailRepository
  }

  async auth (email, password) {
    if (!email) {
      throw new MissingParamError('email')
    }
    if (!password) {
      throw new MissingParamError('password')
    }

    await this.loadUserByEmailRepository.load(email)
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

  it('should call LoadUserByEmailRepository with correct email', async () => {
    class LoadUserByEmailRepositorySpy {
      async load (email) {
        this.email = email
      }
    }
    const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()

    const sut = new AuthUseCaseSpy(loadUserByEmailRepositorySpy)
    await sut.auth('any_example@mail.com', 'valid_password')
    expect(loadUserByEmailRepositorySpy.email).toBe('any_example@mail.com')
  })
})
