import React, { Component } from 'react'
import { Link, Switch, Route, withRouter } from 'react-router-dom'
import config from './config'
import './App.css'
import Home from './pages/Home'
import AddFolder from './pages/AddFolder'
import AddNote from './pages/AddNote'
import NotePage from './pages/NotePage'
import ErrorBoundary from './components/ErrorBoundary'
import AppContext from './appContext'



class App extends Component {
	state = {
		folders: [],
		notes: [],
		addFolder: () => {},
		addNote: () => {},
		deleteNote: () => {}
	}

	//This is the request to our API service that populates our list of folders
	fetchFolders() {
		fetch(`${config.API_ENDPOINT}/folder`)
			.then(res => res.json())
			.then(resJSON => this.setState({ folders: resJSON }))
			.catch(err => {
				console.log(err)
			})
	}
	//This is the request to our API service that populates our list of notes
	fetchNotes() {
		fetch(`${config.API_ENDPOINT}/note`)
			.then(res => res.json())
			.then(resJSON => this.setState({ notes: resJSON }))
			.catch(err => {
				console.log(err)
			})
	}
	//This API request makes a POST request to our server to create a new folder 
	addFolder = folderName => {
		fetch(`${config.API_ENDPOINT}/folder`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ name: folderName })
		})
			.then(res => res.json())
			.then(resJSON => {
				const newFolders = [...this.state.folders, resJSON]
				this.setState({ folders: newFolders })

				this.props.history.push('/')
			})
			.catch(err => {
				console.log(err)
			})
	}

	//This API request makes a POST request to our server to create a new note
	addNote = note => {
		fetch(`${config.API_ENDPOINT}/note`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(note)
		})
			.then(res => res.json())
			.then(newNote => {
				console.log({ newNote })
				const newNotes = [...this.state.notes, newNote]
				this.setState({ notes: newNotes })

				this.props.history.push('/')
			})
			.catch(err => {
				console.log(err)
			})
	}

	//This API request makes a DELETE request to our server to delete a specific note 
	deleteNote = (noteId, cb) => {
		fetch(`${config.API_ENDPOINT}/note/${noteId}`, {
			method: 'DELETE',
			headers: {
				'content-type': 'application/json'
			}
		}).then(() => {
			const newNotes = this.state.notes.filter(note => note.id !== noteId)
			this.setState({ notes: newNotes })
			cb && cb()
		})
	}

	componentDidMount() {
		this.fetchFolders()
		this.fetchNotes()
		this.setState({
			addFolder: this.addFolder,
			addNote: this.addNote,
			deleteNote: this.deleteNote
		})
	}

	render() {
		return (
			<AppContext.Provider value={this.state}>
				<header>
					<h1>
						<Link to="/">Noteful</Link>
					</h1>
				</header>
				<div className="wrapper">
					<Switch>
						<Route exact path={['/', '/folder/:folderId']}>
							<ErrorBoundary message="Failed to create the landing page">
								<Home />
							</ErrorBoundary>
						</Route>
						<Route exact path="/add/folder">
							<ErrorBoundary message="Unable to load the add folder page">
								<AddFolder />
							</ErrorBoundary>
						</Route>
						<Route exact path="/add/note">
							<ErrorBoundary message="Unable to load the add note page">
								<AddNote />
							</ErrorBoundary>
						</Route>
						<Route exact path="/note/:noteId">
							<ErrorBoundary message="Unable to obtain matchign note">
								<NotePage />
							</ErrorBoundary>
						</Route>
					</Switch>
				</div>
			</AppContext.Provider>
		)
	}
}

export default withRouter(App)
