
const request = require('supertest')
const app = require('./app')

describe('Setup App', () => {
  it('should disable x-powered-by header', async () => {
    app.get('/test_x_powered_by', (_, res) => res.send(''))
    const response = await request(app).get('/test_x_powered_by')
    expect(response.headers['x-powered-by']).toBeUndefined()
  })

  it('should enable CORS', async () => {
    app.get('/test_cors', (_, res) => res.send(''))
    const response = await request(app).get('/test_cors')
    expect(response.headers['access-control-allow-origin']).toBe('*')
    expect(response.headers['access-control-allow-methods']).toBe('*')
    expect(response.headers['access-control-allow-headers']).toBe('*')
  })
})
