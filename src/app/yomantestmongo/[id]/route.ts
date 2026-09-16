import { Hono } from 'hono'
import { ObjectId } from 'mongodb'
import { getDB } from '../../../config/db.js'

const app = new Hono()
const collectionName = 'yomantestmongo'

function isValidStatus(value: unknown): value is 'active' | 'inactive' {
  return value === 'active' || value === 'inactive'
}

function isValidSource(value: unknown): value is 'api' | 'seed' | 'manual' {
  return value === 'api' || value === 'seed' || value === 'manual'
}

function validateFullPayload(body: any): string | null {
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

function validatePartialPayload(body: any): string | null {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return 'body must be an object'
  }
  const keys = Object.keys(body)
  if (keys.length === 0) {
    return 'at least one field is required'
  }
  if ('name' in body && (typeof body.name !== 'string' || body.name.trim().length === 0)) {
    return 'name must be a non-empty string'
  }
  if ('email' in body && (typeof body.email !== 'string' || body.email.trim().length === 0)) {
    return 'email must be a non-empty string'
  }
  if ('status' in body && !isValidStatus(body.status)) {
    return 'status must be active or inactive'
  }
  if ('metadata' in body) {
    if (typeof body.metadata !== 'object' || body.metadata === null) {
      return 'metadata must be an object'
    }
    if ('source' in body.metadata && !isValidSource(body.metadata.source)) {
      return 'metadata.source must be api, seed, or manual'
    }
    if ('notes' in body.metadata && body.metadata.notes !== null && typeof body.metadata.notes !== 'string') {
      return 'metadata.notes must be a string or null'
    }
  }
  if ('tags' in body && (!Array.isArray(body.tags) || body.tags.some((tag: unknown) => typeof tag !== 'string'))) {
    return 'tags must be an array of strings'
  }
  return null
}

app.get('/:id', async (c) => {
  const id = c.req.param('id')

  if (!ObjectId.isValid(id)) {
    return c.json({ success: false, error: 'Bad Request', message: 'ID tidak valid' }, 400)
  }

  const db = getDB()
  const collection = db.collection(collectionName)
  const document = await collection.findOne({ _id: new ObjectId(id) })

  if (!document) {
    return c.json({ success: false, error: 'Not Found', message: 'Data dengan id tersebut tidak ditemukan' }, 404)
  }

  return c.json({ success: true, data: document, message: 'OK' }, 200)
})

app.put('/:id', async (c) => {
  const id = c.req.param('id')

  if (!ObjectId.isValid(id)) {
    return c.json({ success: false, error: 'Bad Request', message: 'ID tidak valid' }, 400)
  }

  const body = await c.req.json().catch(() => null)

  if (body === null) {
    return c.json({ success: false, error: 'Bad Request', message: 'Invalid JSON body' }, 400)
  }

  const validationError = validateFullPayload(body)

  if (validationError) {
    return c.json({ success: false, error: 'Bad Request', message: validationError }, 400)
  }

  const db = getDB()
  const collection = db.collection(collectionName)

  const update = {
    name: body.name,
    email: body.email,
    status: body.status,
    metadata: {
      source: body.metadata.source,
      notes: body.metadata.notes ?? null
    },
    tags: body.tags,
    updatedAt: new Date()
  }

  try {
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: update },
      { returnDocument: 'after' }
    )

    if (!result) {
      return c.json({ success: false, error: 'Not Found', message: 'Data dengan id tersebut tidak ditemukan' }, 404)
    }

    return c.json({ success: true, data: result, message: 'OK' }, 200)
  } catch (error: any) {
    if (error?.code === 11000) {
      return c.json({ success: false, error: 'Conflict', message: 'Email sudah dipakai' }, 409)
    }
    return c.json({ success: false, error: 'Internal Server Error', message: 'Gagal update data' }, 500)
  }
})

app.patch('/:id', async (c) => {
  const id = c.req.param('id')

  if (!ObjectId.isValid(id)) {
    return c.json({ success: false, error: 'Bad Request', message: 'ID tidak valid' }, 400)
  }

  const body = await c.req.json().catch(() => null)

  if (body === null) {
    return c.json({ success: false, error: 'Bad Request', message: 'Invalid JSON body' }, 400)
  }

  const validationError = validatePartialPayload(body)

  if (validationError) {
    return c.json({ success: false, error: 'Bad Request', message: validationError }, 400)
  }

  const db = getDB()
  const collection = db.collection(collectionName)

  const update: Record<string, unknown> = { updatedAt: new Date() }

  if ('name' in body) update.name = body.name
  if ('email' in body) update.email = body.email
  if ('status' in body) update.status = body.status
  if ('tags' in body) update.tags = body.tags

  if ('metadata' in body) {
    const existing = await collection.findOne({ _id: new ObjectId(id) })

    if (!existing) {
      return c.json({ success: false, error: 'Not Found', message: 'Data dengan id tersebut tidak ditemukan' }, 404)
    }

    update.metadata = {
      source: body.metadata.source ?? existing.metadata.source,
      notes: 'notes' in body.metadata ? body.metadata.notes : existing.metadata.notes
    }
  }

  try {
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: update },
      { returnDocument: 'after' }
    )

    if (!result) {
      return c.json({ success: false, error: 'Not Found', message: 'Data dengan id tersebut tidak ditemukan' }, 404)
    }

    return c.json({ success: true, data: result, message: 'OK' }, 200)
  } catch (error: any) {
    if (error?.code === 11000) {
      return c.json({ success: false, error: 'Conflict', message: 'Email sudah dipakai' }, 409)
    }
    return c.json({ success: false, error: 'Internal Server Error', message: 'Gagal update data' }, 500)
  }
})

app.delete('/:id', async (c) => {
  const id = c.req.param('id')

  if (!ObjectId.isValid(id)) {
    return c.json({ success: false, error: 'Bad Request', message: 'ID tidak valid' }, 400)
  }

  const db = getDB()
  const collection = db.collection(collectionName)
  const result = await collection.findOneAndDelete({ _id: new ObjectId(id) })

  if (!result) {
    return c.json({ success: false, error: 'Not Found', message: 'Data dengan id tersebut tidak ditemukan' }, 404)
  }

  return c.json({ success: true, data: result, message: 'OK' }, 200)
})

export default app