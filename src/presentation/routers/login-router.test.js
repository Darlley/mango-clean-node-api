class LoginRouter {
  route (httpRequest) {
    if(!httpRequest || !httpRequest.body){
      return {
        statusCode: 500
      }
    }

    const { email, password } = httpRequest.body
    if (!email || !password) {
      return {
        statusCode: 400
      }
    }
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
