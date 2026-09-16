import { Hono } from 'hono'
import { getDB } from '../config/db.js'
import type { YomanTestMongo } from './yomantestmongo/route.js'

const app = new Hono()

app.get('/', async (c) => {
  const db = getDB()
  const collection = db.collection<YomanTestMongo>('yomantestmongo')
  const documents = await collection.find().sort({ createdAt: -1 }).limit(20).toArray()

  return c.html(
    <html>
      <head>
        <meta charSet="UTF-8" />
        <title>testmongoLohya</title>
        <style>{`
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            background-color: #0f172a;
            color: #e2e8f0;
            padding: 40px 24px;
          }
          .container {
            max-width: 960px;
            margin: 0 auto;
          }
          h1 {
            font-size: 28px;
            margin-bottom: 8px;
          }
          .subtitle {
            color: #94a3b8;
            margin-bottom: 32px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            background-color: #1e293b;
            border-radius: 8px;
            overflow: hidden;
          }
          th, td {
            text-align: left;
            padding: 12px 16px;
            border-bottom: 1px solid #334155;
          }
          th {
            background-color: #1e293b;
            color: #94a3b8;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          tr:last-child td {
            border-bottom: none;
          }
          .badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 999px;
            font-size: 12px;
            font-weight: 600;
          }
          .badge-active {
            background-color: #14532d;
            color: #86efac;
          }
          .badge-inactive {
            background-color: #450a0a;
            color: #fca5a5;
          }
          .tags {
            display: flex;
            gap: 6px;
            flex-wrap: wrap;
          }
          .tag {
            background-color: #334155;
            color: #cbd5e1;
            font-size: 12px;
            padding: 2px 8px;
            border-radius: 4px;
          }
          .empty {
            text-align: center;
            padding: 48px;
            color: #64748b;
          }
        `}</style>
      </head>
      <body>
        <div class="container">
          <h1>testmongoLohya</h1>
          <p class="subtitle">Data dari collection yomantestmongo</p>
          {documents.length === 0 ? (
            <div class="empty">Belum ada data</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Tags</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr>
                    <td>{doc.name}</td>
                    <td>{doc.email}</td>
                    <td>
                      <span class={`badge ${doc.status === 'active' ? 'badge-active' : 'badge-inactive'}`}>
                        {doc.status}
                      </span>
                    </td>
                    <td>
                      <div class="tags">
                        {doc.tags.map((tag) => (
                          <span class="tag">{tag}</span>
                        ))}
                      </div>
                    </td>
                    <td>{doc.metadata.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </body>
    </html>
  )
})

export default app