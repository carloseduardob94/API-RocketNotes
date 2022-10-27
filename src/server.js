require('express-async-errors')

const AppError = require('./utils/AppError')

const express = require('express')

const app = express()
app.use(express.json())

app.use((error, request, response, next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message
    })
  }

  return response.status(500).json({
    status: 'error',
    messagem: 'Internal Server Error'
  })
})

app.post('/users', (request, response) => {
  const { name, email, password } = request.body

  response.json({ name, email, password })
})

const PORT = 3333

app.listen(PORT, () => console.log(`listening on port ${PORT}`))
