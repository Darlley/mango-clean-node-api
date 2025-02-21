module.exports = {
  mongodbMemoryServerOptions: {
    instance: {
      dbName: 'jest'
    },
    binary: {
      version: '4.0.3',
      skipMD5: true
    },
    autoStart: false
  },
  useSharedDBForAllJestWorkers: false,
  mongoURLEnvName: 'MONGODB_URI'
}
