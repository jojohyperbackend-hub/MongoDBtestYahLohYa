import 'dotenv/config'
import { serve } from '@hono/node-server'
import app from './app.js'
import { connectDB, disconnectDB } from './config/db.js'

const port = Number(process.env.PORT) || 3000

async function main() {
  await connectDB()

  const server = serve({ fetch: app.fetch, port }, (info) => {
    console.log(`Server running at http://localhost:${info.port}`)
  })

  const shutdown = async () => {
    server.close()
    await disconnectDB()
    process.exit(0)
  }

  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
}

main().catch((error) => {
  console.error('Failed to start server:', error)
  process.exit(1)
})