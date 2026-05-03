import dotenv from 'dotenv'
dotenv.config()

import { app } from './app'
import { connectDB } from './config/db'

const PORT = process.env.PORT || 5000

const start = async (): Promise<void> => {
  await connectDB()
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`[server] Running on http://localhost:${PORT}`)
  })
}

start().catch((err: unknown) => {
  console.error('[server] Failed to start:', err)
  process.exit(1)
})
