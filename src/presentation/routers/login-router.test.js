class LoginRouter {
  route (httpRequest) {
    if(!httpRequest || !httpRequest.body){
      return httpResponse.serverError()
    }

    const { email, password } = httpRequest.body
    if (!email) {
      return httpResponse.badRequest('email')
    }
    if (!password) {
      return httpResponse.badRequest('password')
    }
  }
}

class httpResponse {
  static badRequest (paramName) {
    return {
      statusCode: 400,
      body: new MissingParamError(paramName)
    }
  }
  static serverError () {
    return {
      statusCode: 500
    }
  }
}

class MissingParamError extends Error {
  constructor(paramName) {
    super(`Missing param ${paramName}`)
    this.name = 'MissingParamError'
  }
}

describe('Login router', () => {
  test('should return 400 if no email is provider', () => {
    // Arrange (Preparar)
    const sut = new LoginRouter() // system under test
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

  test('should return 400 if no password is provider', () => {
    // Arrange (Preparar)
    const sut = new LoginRouter() // system under test
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

  test("Should return 500 if no httpRequest is provided", () => {
    // Arrange (Preparar)
    const sut = new LoginRouter() // system under test
    // Action (Executar)
    const httpResponse = sut.route()
    // Assert (Validar)
    expect(httpResponse.statusCode).toBe(500)
  })
  
  test("Should return 500 if no httpRequest.body is provided", () => {
    // Arrange (Preparar)
    const sut = new LoginRouter() // system under test
    // Action (Executar)
    const httpResponse = sut.route({})
    // Assert (Validar)
    expect(httpResponse.statusCode).toBe(500)
  })

})
