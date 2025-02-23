const sut = require('./mongo-helper')
const env = require('../../main/config/env')

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await sut.connect(env.MONGO_URL)
  })

  afterAll(async () => {
    await sut.disconnect()
  })

  it('should reconnect when getCollection is invoked and client is disconnected', async () => {
    expect(sut.db).toBeTruthy()
    await sut.disconnect()
    expect(sut.db).toBeFalsy()
    await sut.getCollection('users')
    expect(sut.db).toBeTruthy()
  })
})
