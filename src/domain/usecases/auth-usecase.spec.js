class AuthUseCaseSpy {
  async auth (email) {
    if(!email) {
      throw new Error()
    }
  }
}

describe('Auth UseCase', () => {
  it('should throw if no email is provided', async () => {
    // Arrange
    const sut = new AuthUseCaseSpy()
    const promise = sut.auth()
    expect(promise).rejects.toThrow()
  })
})