const path = require('path')
const express = require('express')
const xss = require('xss')
const FolderService = require('./folder-service')

const folderRouter = express.Router()
const jsonParser = express.json()


//Sanitization is done to prevent xss attacks from malicious parties and is a crucial security step. 
const sanitizeFolder = folder => ({
	...folder,
	name: xss(folder.name)
})

//This Router is one of the two main routers for this section of our app, responding to incoming get requests that query
//our database of records, as and allow new notes ot be inserted.
folderRouter
	.route('/')

  //This section handles all incoming get requests to this endpoint. It maps through all of our records,
  //and then responds with the corresponding data.
	.get((req, res, next) => {
		FolderService.getAllFolders(req.app.get('db'))
			.then(Folders => {
				res.json(Folders.map(sanitizeFolder))
			})
			.catch(next)
	})
  //This section handles all incoming post requests to this route. It verifies that requests contain the 
  //neccesssary data and then handles the requests accordingly. 	
	.post(jsonParser, (req, res, next) => {
		const { name } = req.body
		const newFolder = { name }

		// check for missing fields
		for (const [key, value] of Object.entries(newFolder)) {
			if (value == null) {
				return res.status(400).json({
					error: { message: `Missing '${key}' in request body` }
				})
			}
		}

		FolderService.insertFolder(req.app.get('db'), newFolder)
			.then(folder => {
				res.status(201)
					.location(path.posix.join(req.originalUrl, `${folder.id}`))
					.json(sanitizeFolder(folder))
			})
			.catch(next)
	})

//This router handles requests made for a specific record in our database. It accepts all types of requests
//and can handle all relevant CRUD functions.
folderRouter
	.route('/:folder_id')

	//This section makes sure that the requested entry actually exists within our database.
	.all((req, res, next) => {
		FolderService.getById(req.app.get('db'), req.params.folder_id)
			.then(folder => {
				if (!folder) {
					return res.status(404).json({
						error: { message: `Folder doesn't exist` }
					})
				}
				res.folder = folder
				next()
			})
			.catch(next)
	})

	//This responds with the requested record, after the above section has confirmed it indeed exists.
	.get((req, res, next) => {
		res.json(sanitizeFolder(res.folder))
	})

	//This section enables folders to be updated upon request.
	.patch(jsonParser, (req, res, next) => {
		const { name } = req.body
		const folderToUpdate = { name }

		if (!name) {
			return res.status(400).json({
				error: {
					message: `Request body must contain a 'name'`
				}
			})
		}
		FolderService.updateFolder(
			req.app.get('db'),
			req.params.folder_id,
			folderToUpdate
		)
			.then(() => {
				res.status(204).end()
			})
			.catch(next)
	})

	//This section handles the delete requests, allowing a specific folder to be able to be deleted.
	.delete((req, res, next) => {
		FolderService.deleteFolder(req.app.get('db'), req.params.folder_id)
			.then(() => {
				res.status(204).end()
			})
			.catch(next)
	})

module.exports = folderRouter
