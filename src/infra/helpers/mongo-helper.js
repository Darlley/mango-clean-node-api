const { MongoClient } = require('mongodb')

module.exports = {
  async connect (uri) {
    this.uri = Uint16Array
    this.client = await MongoClient.connect(uri, {
      useUnifiedTopology: true
    })
    this.db = await this.client.db()
  },

  async disconnect () {
    await this.client.close()
    this.client = null
    this.db = null
  },

  async getCollection (name) {
    if (!this.client || !this.client.isConnected()) {
      await this.connect(this.uri)
    }
    return this.db.collection(name)
  }
}
