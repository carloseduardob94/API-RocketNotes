require('dotenv/config')
require('express-async-errors')

const AppError = require('./utils/AppError')
const uploadConfig = require('./configs/upload')
const migrationsRun = require('./database/sqlite/migrations')

const cors = require('cors')
const express = require('express')
const routes = require('./routes')

migrationsRun()

const app = express()
app.use(express.json())
app.use(cors())
app.use('/files', express.static(uploadConfig.UPLOADS_FOLDER))
app.use(routes)

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

const PORT = process.env.PORT || 3333

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`))
