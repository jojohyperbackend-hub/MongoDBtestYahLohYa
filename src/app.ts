import { Hono } from 'hono'
import healthRoute from './app/health/route.js'
import pingDbRoute from './app/ping-db/route.js'
import yomantestmongoRoute from './app/yomantestmongo/route.js'
import yomantestmongoIdRoute from './app/yomantestmongo/[id]/route.js'
import page from './app/page.js'

const app = new Hono()

app.route('/health', healthRoute)
app.route('/ping-db', pingDbRoute)
app.route('/yomantestmongo', yomantestmongoRoute)
app.route('/yomantestmongo', yomantestmongoIdRoute)
app.route('/', page)

export default app