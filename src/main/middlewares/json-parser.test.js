
const request = require('supertest')
const app = require('../config/app')

describe('JSON Parser Middleware', () => {
  it('should parse body as JSON', async () => {
    app.post('/test_json_parser', (req, res) => res.send(req.body))
    await request(app)
      .post('/test_json_parser')
      .send({ name: 'Naruto' })
      .expect({ name: 'Naruto' })
  })
})
