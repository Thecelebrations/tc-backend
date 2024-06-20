const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Note = require('../models/note')

const initialNotes = [
  {
    content: 'HTML is easy',
    importand: true,
  },
  {
    content: 'Selenium is  test framework',
    importand: true,
  }
]

beforeEach(async () => {
  await Note.deleteMany({})
  await new Note(initialNotes[0]).save()
  await new Note(initialNotes[1]).save()
})

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two notes', async () => {
  const response = await api.get('/api/notes')
  assert.strictEqual(response.body.length, initialNotes.length)
})

test('the first note is about HTTP methods', async () => {
  const response = await api.get('/api/notes')
  const contents = response.body.map(e => e.content)
  assert(contents.includes('HTML is easy'))
})

after(async () => {
  await mongoose.connection.close()
})