export const up = async (db) => {
  await db.createCollection('yomantestmongo')

  const collection = db.collection('yomantestmongo')

  await collection.createIndex({ email: 1 }, { unique: true })

  const now = new Date()

  await collection.insertMany([
    {
      name: 'Test Data 1',
      email: 'test1@example.com',
      status: 'active',
      metadata: {
        source: 'seed',
        notes: null
      },
      tags: ['test', 'mongo', 'hono'],
      createdAt: now,
      updatedAt: now
    },
    {
      name: 'Test Data 2',
      email: 'test2@example.com',
      status: 'inactive',
      metadata: {
        source: 'seed',
        notes: 'seed data kedua'
      },
      tags: ['test', 'seed'],
      createdAt: now,
      updatedAt: now
    }
  ])
}

export const down = async (db) => {
  await db.collection('yomantestmongo').drop()
}