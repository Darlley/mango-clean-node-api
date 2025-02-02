const LoginRouter = require('./LoginRouter')
const MissingParamError = require('../helpers/missing-param-error')

const makeSut = () => {
  return new LoginRouter()
}

describe('Login router', () => {
  it('Should return 400 if no email is provider', () => {
    // Arrange (Preparar)
    const sut = makeSut() // system under test
    const httpRequest = {
      body: {
        // email: 'example@mail.com'
        password: 'any_password'
      }
    }
    // Action (Executar)
    const httpResponse = sut.route(httpRequest)
    // Assert (Validar)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  it('Should return 400 if no password is provider', () => {
    // Arrange (Preparar)
    const sut = makeSut() // system under test
    const httpRequest = {
      body: {
        email: 'example@mail.com'
        // password: 'any_password'
      }
    }
    // Action (Executar)
    const httpResponse = sut.route(httpRequest)
    // Assert (Validar)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  it('Should return 500 if no httpRequest is provided', () => {
    // Arrange (Preparar)
    const sut = makeSut() // system under test
    // Action (Executar)
    const httpResponse = sut.route()
    // Assert (Validar)
    expect(httpResponse.statusCode).toBe(500)
  })

  it('Should return 500 if no httpRequest.body is provided', () => {
    // Arrange (Preparar)
    const sut = makeSut() // system under test
    // Action (Executar)
    const httpResponse = sut.route({})
    // Assert (Validar)
    expect(httpResponse.statusCode).toBe(500)
  })
})
