const express = require('express')
const cors = require('cors')
require('dotenv').config()

const todosRouter = require('./routes/todos')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/todos', todosRouter)

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
