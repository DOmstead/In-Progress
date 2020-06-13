import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import AppContext from '../appContext'
import './AddNote.css'


//This files creates our add note form

function AddNote() {
	const history = useHistory()
	const { addNote = () => {}, folders } = useContext(AppContext)

	function handleSubmit(e) {
		e.preventDefault()
		const name = e.target.name.value
		const content = e.target.content.value
		const folder_id = e.target.folderId.value
		const modified = new Date()
		addNote({ name, content, folder_id, modified })
	}

	const folderOptions = folders.map(folder => {
		return (
			<option value={folder.id} key={folder.id}>
				{folder.name}
			</option>
		)
	})

	return (
		<>
			<aside>
				<button onClick={() => history.goBack()}>Go Back</button>
			</aside>
			<main>
				<form id="addNote" onSubmit={e => handleSubmit(e)}>
					<input
						type="text"
						aria-label="note title"
						placeholder="note title"
						name="name"
						required
					/>
					<textarea
						aria-label="note content"
						placeholder="note content"
						name="content"
					/>
					<div>
						<label>
							Select a folder:{' '}
							<select name="folderId">{folderOptions}</select>
						</label>
					</div>

					<button type="submit">Add Note</button>
				</form>
			</main>
		</>
	)
}

export default AddNote
