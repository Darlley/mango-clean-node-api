const LoadUserByEmailRepository = require('./LoadUserByEmailRepository')
const MongoHelper = require('../helpers/mongo-helper')

let db

const makeSut = () => {
  const userModel = db.collection('users')
  const sut = new LoadUserByEmailRepository(userModel)
  return { sut, userModel }
}

describe('LoadUserByEmail Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    db = await MongoHelper.getDb()
  })

  beforeEach(async () => {
    db.collection('users').deleteMany()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
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

  it('shuld throw if no userModel is Provided', async () => {
    const sut = new LoadUserByEmailRepository()
    const promise = sut.load('any_example@mail.com')
    expect(promise).rejects.toThrow()
  })
})
