import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import AppContext from '../appContext'


//This file returns the display of the requested note.
function NoteCard({ note }) {
	const { deleteNote = () => {} } = useContext(AppContext)

	function handleClick(e) {
		e.preventDefault()
		deleteNote(note.id)
	}

	return (
		<article>
			<h2>
				<Link to={`/note/${note.id}`}>{note.name}</Link>
			</h2>
			<p>Date modified on {note.modified}</p>
			<button onClick={e => handleClick(e)}>Delete Note</button>
		</article>
	)
}

NoteCard.propTypes = {
	note: PropTypes.object.isRequired
}

export default NoteCard
