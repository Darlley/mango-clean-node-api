module.exports = {
  MONGO_URL: global.__MONGO_URI__ || 'mongodb://localhost:27017/mongo-api',
  TOKEN_SECRET: process.env.TOKEN_SECRET || 'secret'
}
