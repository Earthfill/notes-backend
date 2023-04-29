require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")

const Note = require("./models/note")

const app = express()

morgan.token("body", (request) => JSON.stringify(request.body))

const requestLogger = (request, response, next) => {
	console.log("Method:", request.method)
	console.log("Path:  ", request.path)
	console.log("Body:  ", request.body)
	console.log("---")
	next()
}

app.use(express.static("build"))
app.use(express.json())
app.use(morgan(":method :url :status :response-time ms - :res[content-length] :body"))
app.use(cors())
app.use(requestLogger)

app.get("/", (request, response) => {
	response.send("<h1>Hello World!</h1>")
})

app.get("/api/notes", (request, response) => {
	Note.find({}).then(notes => {
		response.json(notes)
	})
})

app.get("/api/notes/:id", (request, response, next) => {
	const id = request.params.id
	Note.findById(id)
		.then(note => {
			if (note) {
				response.json(note)
			} else {
				response.status(404).end()
			}
		})
		.catch(error => next(error))
})

app.post("/api/notes", (request, response, next) => {
	const body = request.body

	Note.findOne({ content: body.content })
		.then(existingNote => {
			if (existingNote) {
				return response.status(409).json({ error: "Note already exists" })
			}

			const note = new Note({
				content: body.content,
				important: body.important || false,
			})

			note.save()
				.then(savedNote => {
					response.json(savedNote)
				})
				.catch(error => next(error))
		})
		.catch(error => next(error))
})

app.put("/api/notes/:id", (request, response, next) => {
	const id = request.params.id
	const body = request.body

	const note = {
		content: body.content,
		important: body.important,
	}

	Note.findByIdAndUpdate(id, note, { new: true, runValidators: true, context: "query" })
		.then(updatedNote => {
			response.json(updatedNote)
		})
		.catch(error => next(error))
})

app.delete("/api/notes/:id", (request, response, next) => {
	const id = request.params.id
	Note.findByIdAndRemove(id)
		.then(() => {
			response.status(204).end()
		})
		.catch(error => next(error))
})

// this has to be the last loaded middleware.

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: "unknown endpoint" })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
	console.error(error.message)

	if (error.name === "CastError") {
		return response.status(400).send({ error: "malformatted id" })
	} else if (error.name === "ValidationError") {
		return response.status(400).json({ error: error.message })
	}

	next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})