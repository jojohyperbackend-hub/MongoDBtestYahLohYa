import 'dotenv/config'
import { MongoClient, Db } from 'mongodb'

const uri = process.env.MONGO_URI
const dbName = process.env.MONGO_DB_NAME

if (!uri) {
  throw new Error('MONGO_URI is not defined')
}

if (!dbName) {
  throw new Error('MONGO_DB_NAME is not defined')
}

let client: MongoClient | null = null
let db: Db | null = null

export async function connectDB(): Promise<Db> {
  if (db) {
    return db
  }

  client = new MongoClient(uri)
  await client.connect()
  db = client.db(dbName)

  return db
}

export function getDB(): Db {
  if (!db) {
    throw new Error('Database not connected. Call connectDB first.')
  }

  return db
}

export async function disconnectDB(): Promise<void> {
  if (client) {
    await client.close()
    client = null
    db = null
  }
}