class LoginRouter {
  route (httpRequest) {
    const { emai, password } = httpRequest.body
    if (!emai || !password) {
      return {
        statusCode: 400
      }
    }
  }
}

describe('Login router', () => {
  // Se não existe email = 400
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

  // Se não existe password = 400
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
})
