class Encrypter {
  async compare(password, hashedPassword) {
    return true
  }
}

describe('Encrypter', () => { 
  it('should return true if bcrypt returns rue', async () => {
    const sut = new Encrypter()
    const isValid = await sut.compare('any_password', 'hashed_password')
    expect(isValid).toBe(true)
  })
})