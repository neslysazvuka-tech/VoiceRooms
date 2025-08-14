import express from 'express'
import cors from 'cors'
import apiRouter from './routes/api'
import { createServer } from 'http'
import { setupWebSocket } from './controllers/wsController'

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api', apiRouter)

// Static files (for production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/dist'))
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'client', 'dist', 'index.html'))
  })
}

// Create HTTP server
const server = createServer(app)

// Setup WebSocket
setupWebSocket(server)

export { app, server }
