import React, { useContext } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import AppContext from '../appContext'


//This file shows the specified note

function NotePage() {
	const { notes = [], deleteNote = () => {} } = useContext(AppContext)
	const { noteId } = useParams()
	const history = useHistory()
	const note = notes.find(note => note.id === parseInt(noteId)) || {}

	function handleClick(e) {
		e.preventDefault()
		deleteNote(note.id, () => {
			history.push('/')
		})
	}

	return (
		<>
			<aside>
				<button onClick={() => history.goBack()}>Go back</button>
			</aside>
			<main>
				{note.name ? (
					<>
						<h2>{note.name}</h2>
						<p>{note.content}</p>
						<p>Date modified: {note.modified}</p>
						<button onClick={e => handleClick(e)}>
							Delete Note
						</button>
					</>
				) : (
					<p>No Note Present</p>
				)}
			</main>
		</>
	)
}

export default NotePage
