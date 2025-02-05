const LoginRouter = require('./LoginRouter')
const MissingParamError = require('../helpers/missing-param-error')
const UnauthorizedError = require('../helpers/unauthorized-error')

const makeSut = () => {
  class AuthUseCaseSpy {
    auth (email, password) {
      this.email = email
      this.password = password
    }
  }
  const authUseCaseSpy = new AuthUseCaseSpy()
  const sut = new LoginRouter(authUseCaseSpy) // dependency injection

  return {
    sut, authUseCaseSpy
  }
}

describe('Login router', () => {
  it('Should return 400 if no email is provider', () => {
    // Arrange (Preparar)
    const { sut } = makeSut() // system under test
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
    const { sut } = makeSut() // system under test
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
    const { sut } = makeSut() // system under test
    // Action (Executar)
    const httpResponse = sut.route()
    // Assert (Validar)
    expect(httpResponse.statusCode).toBe(500)
  })

  it('Should return 500 if no httpRequest.body is provided', () => {
    // Arrange (Preparar)
    const { sut } = makeSut() // system under test
    // Action (Executar)
    const httpResponse = sut.route({})
    // Assert (Validar)
    expect(httpResponse.statusCode).toBe(500)
  })

  it('Should call AuthUseCaseSpy with correct params', () => {
    const { sut, authUseCaseSpy } = makeSut()
    const httpRequest = {
      body: {
        email: 'example@mail.com',
        password: 'any_password'
      }
    }
    sut.route(httpRequest)
    expect(authUseCaseSpy.email).toBe(httpRequest.body.email)
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password)
  })

  it('Should return when invalid credentials are provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'invalid_example@mail.com',
        password: 'invalid_password'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual(new UnauthorizedError())
  })

  it('Should return 500 when if no AuthUseCaseSpy is provided', () => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        email: 'example@mail.com',
        password: 'any_password'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
  })
  
  it('Should return 500 when if AuthUseCaseSpy has no auth method', () => {
    const sut = new LoginRouter({})
    const httpRequest = {
      body: {
        email: 'example@mail.com',
        password: 'any_password'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
  })
})
