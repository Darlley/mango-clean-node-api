
const request = require('supertest')
const app = require('./app')

describe('Setup App', () => {
  it('should disable x-powered-by header', async () => {
    app.get('/test-x-powered-by', (_, res) => res.send(''))
    const response = await request(app).get('/test-x-powered-by')
    expect(response.headers['x-powered-by']).toBeUndefined()
  })
})
