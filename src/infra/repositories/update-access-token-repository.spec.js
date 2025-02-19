const MongoHelper = require('../helpers/mongo-helper')
const { MissingParamError } = require('../../utils/errors')
const UpdateAccessTokenRepository = require('./update-access-token-repository')

let db

const makeSut = () => {
  const userModel = db.collection('user')
  const sut = new UpdateAccessTokenRepository(userModel)
  return { sut, userModel }
}

describe('UpdateAccessToken Repository', () => {
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

  it('should update the user with the given acessToken', async () => {
    const { sut, userModel } = makeSut()
    const fakeUser = await userModel.insertOne({
      email: 'valid_example@mail.com',
      name: 'any_name',
      age: 26,
      state: 'any_state',
      password: 'hashed_password'
    })
    await sut.update(fakeUser.ops[0]._id, 'valid_token')
    const updatedFakeUser = await userModel.findOne({ _id: fakeUser.ops[0]._id })
    expect(updatedFakeUser.accessToken).toBe('valid_token')
  })

  it('should throw of no userModel is provided', async () => {
    const userModel = db.collection('user')
    const sut = new UpdateAccessTokenRepository()
    const fakeUser = await userModel.insertOne({
      email: 'valid_example@mail.com',
      name: 'any_name',
      age: 26,
      state: 'any_state',
      password: 'hashed_password'
    })
    const promise = sut.update(fakeUser.ops[0]._id, 'valid_token')
    expect(promise).rejects.toThrow()
  })

  it('should throw if no params is provided', async () => {
    const { sut, userModel } = makeSut()
    expect(sut.update()).rejects.toThrow(new MissingParamError('userId'))

    const fakeUser = await userModel.insertOne({
      email: 'valid_example@mail.com',
      name: 'any_name',
      age: 26,
      state: 'any_state',
      password: 'hashed_password'
    })
    expect(sut.update(fakeUser.ops[0]._id)).rejects.toThrow(new MissingParamError('accessToken'))
  })
})
