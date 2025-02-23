const request = require('supertest')
const app = require('../config/app')
const bcrypt = require('bcrypt')
const MongoHelper = require('../../infra/helpers/mongo-helper')
const env = require('../config/env')

let userModel

describe('LoginRoutes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.MONGO_URL)
    userModel = await MongoHelper.getCollection('users')
  })

  beforeEach(async () => {
    userModel.deleteMany()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  it('should return 200 when valid credentials are provided', async () => {
    await userModel.insertOne({
      email: 'valid_example@mail.com',
      password: bcrypt.hashSync('hashed_password', 10)
    })

    await request(app)
      .post('/api/login')
      .send({ email: 'valid_example@mail.com', password: 'hashed_password' })
      .expect(200)
  })

  it('should return 401 when invalid credentials are provided', async () => {
    await request(app)
      .post('/api/login')
      .send({ email: 'valid_example@mail.com', password: 'hashed_password' })
      .expect(401)
  })
})
