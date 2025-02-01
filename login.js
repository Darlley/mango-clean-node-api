const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const AccountModel = mongoose.model('Account')

module.exports = () => {
  router.post('/signup', new SignUpRouter().route) // .route é um ponteiro que ja recebe no callback os parametros
}

/**
 * Classe sobrecarregada:
 * - validação do req, res
 * - regra de negócio (password e repeartPassword precisam ser iguais)
 * - acesso ao banco de dados
 */
class SignUpRouter {
  async route (req, res) {
    const { email, password, repeatPassword } = req.body
    if (password === repeatPassword) {
      const user = await AccountModel.create({ email, password })
      return res.json(user)
    }
    res.status(400).json({ error: 'password must be equal to repeatPassword' })
  }
}
