import { Hono } from 'hono'
import { getDB } from '../../config/db.js'

export interface YomanTestMongoMetadata {
  source: 'api' | 'seed' | 'manual'
  notes?: string | null
}

export interface YomanTestMongo {
  _id?: string
  name: string
  email: string
  status: 'active' | 'inactive'
  metadata: YomanTestMongoMetadata
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

const app = new Hono()
const collectionName = 'yomantestmongo'

function isValidStatus(value: unknown): value is 'active' | 'inactive' {
  return value === 'active' || value === 'inactive'
}

function isValidSource(value: unknown): value is 'api' | 'seed' | 'manual' {
  return value === 'api' || value === 'seed' || value === 'manual'
}

function validateCreatePayload(body: any): string | null {
  if (typeof body?.name !== 'string' || body.name.trim().length === 0) {
    return 'name is required'
  }
  if (typeof body?.email !== 'string' || body.email.trim().length === 0) {
    return 'email is required'
  }
  if (!isValidStatus(body?.status)) {
    return 'status must be active or inactive'
  }
  if (typeof body?.metadata !== 'object' || body.metadata === null) {
    return 'metadata is required'
  }
  if (!isValidSource(body.metadata.source)) {
    return 'metadata.source must be api, seed, or manual'
  }
  if (body.metadata.notes !== undefined && body.metadata.notes !== null && typeof body.metadata.notes !== 'string') {
    return 'metadata.notes must be a string or null'
  }
  if (!Array.isArray(body?.tags) || body.tags.some((tag: unknown) => typeof tag !== 'string')) {
    return 'tags must be an array of strings'
  }
  return null
}

app.get('/', async (c) => {
  const db = getDB()
  const collection = db.collection(collectionName)

  const status = c.req.query('status')
  const tags = c.req.query('tags')
  const search = c.req.query('search')
  const limitParam = c.req.query('limit')
  const pageParam = c.req.query('page')

  const limit = limitParam ? Math.max(parseInt(limitParam, 10), 1) : 10
  const page = pageParam ? Math.max(parseInt(pageParam, 10), 1) : 1
  const skip = (page - 1) * limit

  const filter: Record<string, unknown> = {}

  if (status) {
    filter.status = status
  }

  if (tags) {
    filter.tags = { $in: tags.split(',').map((tag) => tag.trim()) }
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ]
  }

  const [items, total] = await Promise.all([
    collection.find(filter).skip(skip).limit(limit).toArray(),
    collection.countDocuments(filter)
  ])

  return c.json({
    success: true,
    data: { items, page, limit, total },
    message: 'OK'
  }, 200)
})

app.post('/', async (c) => {
  const body = await c.req.json().catch(() => null)

  if (body === null) {
    return c.json({ success: false, error: 'Bad Request', message: 'Invalid JSON body' }, 400)
  }

  const validationError = validateCreatePayload(body)

  if (validationError) {
    return c.json({ success: false, error: 'Bad Request', message: validationError }, 400)
  }

  const db = getDB()
  const collection = db.collection(collectionName)

  const now = new Date()

  const document = {
    name: body.name,
    email: body.email,
    status: body.status,
    metadata: {
      source: body.metadata.source,
      notes: body.metadata.notes ?? null
    },
    tags: body.tags,
    createdAt: now,
    updatedAt: now
  }

  try {
    const result = await collection.insertOne(document)
    return c.json({
      success: true,
      data: { _id: result.insertedId, ...document },
      message: 'OK'
    }, 201)
  } catch (error: any) {
    if (error?.code === 11000) {
      return c.json({ success: false, error: 'Conflict', message: 'Email sudah dipakai' }, 409)
    }
    return c.json({ success: false, error: 'Internal Server Error', message: 'Gagal membuat data' }, 500)
  }
})

export default app