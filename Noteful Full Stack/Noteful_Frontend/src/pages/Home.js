import React from 'react'
import { Link } from 'react-router-dom'
import FolderList from '../components/FolderList'
import NotesList from '../components/NotesList'
import ErrorBoundary from '../components/ErrorBoundary'

//This files creates our landing page

function Home() {
	return (
		<>
			<ErrorBoundary message="Couldn't load the folder list">
				<FolderList />
			</ErrorBoundary>
			<main>
				<h2>Notes</h2>
				<Link to="/add/note">Add Note +</Link>
				<ErrorBoundary message="Couldn't load notes">
					<NotesList />
				</ErrorBoundary>
			</main>
		</>
	)
}

export default Home
