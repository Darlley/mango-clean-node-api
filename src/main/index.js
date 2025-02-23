const MongoHelper = require('../infra/helpers/mongo-helper')
const env = require('./config/env')

MongoHelper.connect(env.MONGO_URL)
  .then(() => {
    const app = require('./config/app')
    app.listen(env.PORT, () => console.log(`Server Running at localhost:${env.PORT}`))
  })
  .catch(console.error)
