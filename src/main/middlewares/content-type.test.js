
const request = require('supertest')
const app = require('../config/app')

describe('Content-Type Middleware', () => {
  it('should return JSON Content-Type as default', async () => {
    app.get('/test_content_type', (_, res) => res.send(''))

    await request(app)
      .get('/test_content_type')
      .expect('content-type', /json/)
  })

  it('should return xml Content-Type if forced', async () => {
    app.get('/test_content_type_xml', (_, res) => {
      res.type('xml')
      res.send('')
    })

    await request(app)
      .get('/test_content_type_xml')
      .expect('content-type', /xml/)
  })
})
