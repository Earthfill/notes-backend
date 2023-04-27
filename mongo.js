// const mongoose = require('mongoose')

// if (process.argv.length<3) {
//   console.log('give password as argument')
//   process.exit(1)
// }

// const password = process.argv[2]

// const url =`mongodb+srv://Earthfill:${password}@render-notes.ygqhq7m.mongodb.net/?retryWrites=true&w=majority`

// mongoose.set('strictQuery',false)
// mongoose.connect(url)

// const noteSchema = new mongoose.Schema({
//   content: String,
//   important: Boolean
// })

// const Note = mongoose.model('Note', noteSchema)

// const note = [
//   new Note({ content: 'HTML is Easy', important: true }),
//   new Note({ content: 'Browser can execute only JavaScript', important: false }),
//   new Note({ content: 'GET and POST are the most important methods of HTTP protocol', important: true })
// ]

// // note.save().then(result => {
// //   console.log('note saved!')
// //   mongoose.connection.close()
// // })

// // Note.insertMany(note).then(result => {
// //   console.log('notes saved!')
// //   mongoose.connection.close()
// // })

// Note.find({}).then(result => {
//   result.forEach(note => {
//     console.log(note)
//   })
//   mongoose.connection.close()
// })