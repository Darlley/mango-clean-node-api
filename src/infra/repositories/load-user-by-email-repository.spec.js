const { MongoClient } = require('mongodb')

let connection, db

class LoadUserByEmailRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async load (email) {
    const user = await this.userModel.findOne(
      {
        email
      },
      {
        projection: {
          password: 1
        }
      }
    )
    return user
  }
}

const makeSut = () => {
  const userModel = db.collection('users')
  const sut = new LoadUserByEmailRepository(userModel)
  return { sut, userModel }
}

describe('LoadUserByEmail Repository', () => {
  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.MONGO_URL, {
      useUnifiedTopology: true
    })
    db = await connection.db()
  })

  beforeEach(async () => {
    db.collection('users').deleteMany()
  })

  it('shuld return null if no user is found', async () => {
    const { sut } = makeSut()
    const user = await sut.load('invalid_example@mail.com')
    expect(user).toBeNull()
  })

  it('shuld return an user if user is found', async () => {
    const { sut, userModel } = makeSut()

    const fakeUser = await userModel.insertOne({
      email: 'valid_example@mail.com',
      name: 'any_name',
      age: 26,
      state: 'any_state',
      password: 'hashed_password'
    })

    const user = await sut.load('valid_example@mail.com')
    expect(user).toEqual({
      _id: fakeUser.ops[0]._id,
      password: fakeUser.ops[0].password
    })
  })

  afterAll(async () => {
    await connection.close()
  })
})
