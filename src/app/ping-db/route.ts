import { Hono } from 'hono'
import { getDB } from '../../config/db.js'

const app = new Hono()

app.get('/', async (c) => {
  try {
    const db = getDB()
    await db.command({ ping: 1 })
    return c.json({ success: true, data: { connected: true }, message: 'OK' }, 200)
  } catch {
    return c.json({ success: false, error: 'Internal Server Error', message: 'Koneksi ke MongoDB gagal' }, 500)
  }
})

export default app