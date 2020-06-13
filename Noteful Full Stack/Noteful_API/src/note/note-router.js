const path = require('path')
const express = require('express')
const xss = require('xss')
const NoteService = require('./note-service')

const noteRouter = express.Router()
const jsonParser = express.json()

//Sanitization is done to prevent xss attacks from malicious parties and is a crucial security step. 
const sanitizeNote = note => ({
	...note,
	name: xss(note.name),
	content: xss(note.content)
})

//This Router is one of the two main routers for this section of our app, responding to incoming get requests that query
//our database of records, as and allow new notes ot be inserted.
noteRouter
	.route('/')

  //This section handles all incoming get requests to this endpoint. It maps through all of our records,
  //and then responds with the corresponding data.
	.get((req, res, next) => {
		NoteService.getAllNotes(req.app.get('db'))
			.then(notes => {
				res.json(notes.map(sanitizeNote))
			})
			.catch(next)
	})
  //This section handles all incoming post requests to this route. It verifies that requests contain the 
  //neccesssary data and then handles the requests accordingly. 
	.post(jsonParser, (req, res, next) => {
		const { name, content, folder_id } = req.body
		const newNote = { name, content, folder_id }
		for (const [key, value] of Object.entries(newNote)) {
			if (value == null) {
				return res.status(400).json({
					error: { message: `Missing '${key}' in request body` }
				})
			}
		}

		NoteService.insertNote(req.app.get('db'), newNote)
			.then(note => {
				res.status(201)
					.location(path.posix.join(req.originalUrl, `${note.id}`))
					.json(sanitizeNote(note))
			})
			.catch(next)
	})

//This router handles requests made for a specific record in our database. It accepts all types of requests
//and can handle all relevant CRUD functions.
noteRouter
	.route('/:note_id')

	  //This section makes sure that the requested entry actually exists within our database.
	.all((req, res, next) => {
		NoteService.getById(req.app.get('db'), req.params.note_id)
			.then(note => {
				if (!note) {
					return res.status(404).json({
						error: { message: `Note is not valid. Please request a valid Note` }
					})
				}
				res.note = note
				next() 
			})
			.catch(next)
	})

	  //This responds with the requested record, after the above section has confirmed it indeed exists.
	.get((req, res, next) => {
		res.json(sanitizeNote(res.note))
	})

	//This section enables notes to be updated upon request.
	.patch(jsonParser, (req, res, next) => {
		const { name, content, folder_id } = req.body
		const noteToUpdate = { name, content, folder_id }

		if (!name && !content && !folder_id) {
			return res.status(400).json({
				error: {
					message: `This request is missing a required value. Please ensure your item has a name, content message, and valid folder ID `
				}
			})
		}
		NoteService.updateNote(
			req.app.get('db'),
			req.params.note_id,
			noteToUpdate
		)
			.then(() => {
				res.status(204).end()
			})
			.catch(next)
	})

	//This section handles the delete requests, allowing a specific entry to be able to be deleted.
	.delete((req, res, next) => {
		NoteService.deleteNote(req.app.get('db'), req.params.note_id)
			.then(() => {
				res.status(204).end()
			})
			.catch(next)
	})

module.exports = noteRouter
