const mongoose = require('mongoose')

if(process.argv.length < 3){
  console.log(`give password as an argument`)
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://admin:${password}@cluster18.fml6v4x.mongodb.net/testNoteApp?retryWrites=true&w=majority&appName=Cluster18`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  lastname: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
  content: 'selenium helps',
  important: true,
})

note.save().then(() => {
  console.log(`noter saved!`)
  mongoose.connection.close()
})

// Note.find({important: true}).then(result => {
//     result.forEach(note => {
//         console.log(note)
//     })
//     mongoose.connection.close()
// })