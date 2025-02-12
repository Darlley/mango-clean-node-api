const { MissingParamError } = require('../../utils/errors')
const AuthUseCase = require('./auth-usecase')

const makeSut = () => {
  class LoadUserByEmailRepositorySpy {
    async load (email) {
      this.email = email

      return this.user
    }
  }
  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()
  loadUserByEmailRepositorySpy.user = {} // por padrão um user válido
  const sut = new AuthUseCase(loadUserByEmailRepositorySpy)
  return { sut, loadUserByEmailRepositorySpy }
}

describe('Auth UseCase', () => {
  it('should throw if no email is provided', async () => {
    // Arrange
    const { sut } = makeSut()
    const promise = sut.auth()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  it('should throw if no password is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.auth('any_example@mail.com')
    expect(promise).rejects.toThrow(new MissingParamError('password'))
  })

  it('should call LoadUserByEmailRepository with correct email', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    await sut.auth('any_example@mail.com', 'valid_password')
    expect(loadUserByEmailRepositorySpy.email).toBe('any_example@mail.com')
  })

  it('should throw if no loadUserByEmailRepository is provided', async () => {
    const sut = new AuthUseCase()
    const promise = sut.auth('any_example@mail.com', 'valid_password')
    expect(promise).rejects.toThrow()
  })

  it('should throw if no loadUserByEmailRepository has no load method', async () => {
    const sut = new AuthUseCase({})
    const promise = sut.auth('any_example@mail.com', 'valid_password')
    expect(promise).rejects.toThrow()
  })

  it('should return null if and invalid email is provided', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
    loadUserByEmailRepositorySpy.user = null
    const accessToken = await sut.auth('invalid_example@mail.com', 'any_password')
    expect(accessToken).toBeNull()
  })

  it('should return null if and invalid password is provided', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.auth('valid_example@mail.com', 'invalid_password')
    expect(accessToken).toBeNull()
  })
})
