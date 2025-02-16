const { MongoClient } = require('mongodb')

class LoadUserByEmailRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async load (email) {
    const user = await this.userModel.findOne({ email })
    return user
  }
}

describe('LoadUserByEmail Repository', () => {
  let connection, db

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.MONGO_URL)
    db = await connection.db()
  })

  it('shuld return null if no user is found', async () => {
    const userModel = db.collection('users')
    const sut = new LoadUserByEmailRepository(userModel)
    const user = await sut.load('invalid_example@mail.com')
    expect(user).toBeNull()
  })

  it('shuld return an user if user is found', async () => {
    const userModel = db.collection('users')
    await userModel.insertOne({
      email: 'valid_example@mail.com'
    })

    const sut = new LoadUserByEmailRepository(userModel)
    const user = await sut.load('valid_example@mail.com')
    expect(user.email).toBe('valid_example@mail.com')
  })

  afterAll(async () => {
    await connection.close()
  })
})
