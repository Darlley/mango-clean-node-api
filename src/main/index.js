const MongoHelper = require('../infra/helpers/mongo-helper')
const env = require('./config/env')

MongoHelper.connect(env.MONGO_URL)
  .then(() => {
    const app = require('./config/app')
    app.listen(5858, () => console.log('Server Running'))
  })
  .catch(console.error)
