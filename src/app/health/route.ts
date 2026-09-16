import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.json({ success: true, data: { status: 'ok' }, message: 'OK' }, 200)
})

export default app