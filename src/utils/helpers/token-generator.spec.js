class TokenGerator {
  async generate (id) {
    return null
  }
}

const makeSut = () => {
  const sut = new TokenGerator()
  return { sut }
}

describe('Token Generator', () => {
  it('should return null if JWT returns null', async () => {
    const { sut } = makeSut()
    const token = await sut.generate('any_id')
    expect(token).toBe(null)
  })
})
