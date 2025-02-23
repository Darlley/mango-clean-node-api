module.exports = {
  MONGO_URL: 'mongodb://localhost:27017/mongo-api',
  TOKEN_SECRET: process.env.TOKEN_SECRET || 'secret',
  PORT: process.env.port || 5858
}
