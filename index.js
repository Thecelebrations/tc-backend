const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

app.use(cors())
app.use(express.json())

const requestLogger = (request, response, next) => {
    console.log(`Method:`, request.method)
    console.log(`Path:`, request.path)
    console.log(`Body:`, request.body)
    console.log('---')
    next()
}

app.use(requestLogger)

app.use(express.static('dist'))

// mongoose connection
const password = process.argv[2]
const url = `mongodb+srv://admin:${password}@cluster18.fml6v4x.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster18`
mongoose.set('strictQuery',false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Note = mongoose.model('Note', noteSchema)


let notes = [
    {
        id: 1,
        content: 'dipak'
    },
    {
        id: 2,
        content: 'anjali'
    },
]

const generateId = () => {
    const maxId = notes.length > 0
      ? Math.max(...notes.map(n => n.id))
      : 0
    return maxId + 1
}

app.get('/', (request, response) => {
    response.send('<h1>Hello world!</h1>')
})

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.get(`/api/notes/:id`, (request, response) => {
    const note = notes.find(n => n.id === Number(request.params.id))
    if(! note) return response.status(404).end()
    response.json(note)
})

app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
  
    response.status(204).end()
})

app.post('/api/notes', (request, response) => {
    const body = request.body

    if (!body.content) {
        return response.status(400).json({ 
          error: 'content missing' 
        })
      }
  
    if (!body.content) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }
  
    const note = {
      content: body.content,
      important: Boolean(body.important) || false,
      id: generateId(),
    }
  
    notes = notes.concat(note)
  
    response.json(note)
  })

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'Unknown endpoint'})
}
app.use(unknownEndpoint)

const PORT =  process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})