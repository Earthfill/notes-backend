const notesRouter = require("express").Router()
const Note = require("../models/note")

notesRouter.get("/", async (request, response) => {
	const notes = await Note.find({})
	response.json(notes)
})

notesRouter.get("/:id", async (request, response) => {
	const note = await Note.findById(request.params.id)
	if (note) {
		response.json(note)
	} else {
		response.status(404).end()
	}
})

notesRouter.post("/", async (request, response) => {
	const body = request.body

	const existingNote = await Note.findOne({ content: body.content })
	if (existingNote) {
		return response.status(409).json({ error: "Note already exists" })
	}

	const note = new Note({
		content: body.content,
		important: body.important || false,
	})

	const savedNote = await note.save()

	response.status(201).json(savedNote)
})

notesRouter.put("/:id", async (request, response) => {
	const body = request.body
	const note = {
		content: body.content,
		important: body.important,
	}

	const updatedNote = await Note.findByIdAndUpdate(request.params.id, note, { new: true })
	return response.json(updatedNote)
})

notesRouter.delete("/:id", async (request, response) => {
	await Note.findByIdAndRemove(request.params.id)
	response.status(204).end()
})

module.exports = notesRouter