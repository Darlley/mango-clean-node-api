class LoginRouter {
  route (httpRequest) {
    if (!httpRequest.body.email) {
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
        // email: 'example@mail.com' # primeiro queremos testar se o email não existe
        password: 'any_password'
      }
    }
    // Action (Executar)
    const httpResponse = sut.route(httpRequest)
    // Assert (Validar)
    expect(httpResponse.statusCode).toBe(400)
  })
})
