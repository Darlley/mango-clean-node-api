const LoginRouterComposer = require('../composers/login-router-composer')
const { adapt } = require('../adpaters/express-router-adapter')

module.exports = router => {
  const loginRouter = LoginRouterComposer.compose()
  router.post('/login', adapt(loginRouter))
}
