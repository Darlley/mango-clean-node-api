const { MissingParamError } = require('../../utils/errors')
const LoadUserByEmailRepository = require('./load-user-by-email-repository')
const MongoHelper = require('../helpers/mongo-helper')

let userModel

const makeSut = () => {
  return new LoadUserByEmailRepository()
}

describe('LoadUserByEmail Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    userModel = await MongoHelper.getCollection('users')
  })

  beforeEach(async () => {
    userModel.deleteMany()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  it('shuld return null if no user is found', async () => {
    const sut = makeSut()
    const user = await sut.load('invalid_example@mail.com')
    expect(user).toBeNull()
  })

  it('shuld return an user if user is found', async () => {
    const sut = makeSut()

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

  it('shuld throw if no email is provided', async () => {
    const sut = makeSut()
    const promise = sut.load()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })
})
