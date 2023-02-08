const { hash } = require('bcryptjs')
const AppError = require('../utils/AppError')
const sqliteConnection = require('../database/sqlite')

class UsersController {
  async create(request, response) {
    const { name, email, password } = request.body

    if (!name) {
      throw new AppError('Nome é obrigatório')
    } else if (!email) {
      throw new AppError('E-mail é obrigatório')
    }

    const database = await sqliteConnection()

    const checkUser = await database.get(
      'SELECT * FROM users WHERE email = (?)',
      [email]
    )

    if (checkUser) {
      throw new AppError('Este e-mail já está cadastrado.')
    }

    const hashedPassword = await hash(password, 8)

    await database.run(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    )

    return response.status(201).json()
  }
}

module.exports = UsersController
