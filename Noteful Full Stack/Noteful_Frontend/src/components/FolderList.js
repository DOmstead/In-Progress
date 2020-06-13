import React, { useContext } from 'react'
import AppContext from '../appContext'
import { Link, NavLink } from 'react-router-dom'


//This file returns our folder list.
function FolderList() {
	const { folders = [] } = useContext(AppContext)
	const folderList = folders.map(folder => (
		<li key={folder.id}>
			<NavLink to={`/folder/${folder.id}`} activeClassName="active">
				{folder.name}
			</NavLink>
		</li>
	))
	return (
		<aside>
			<h2> Check out these cool Folders</h2>
			<Link to="/add/folder">Click here to add a folder</Link>
			<nav>
				<ul>{folderList}</ul>
			</nav>
		</aside>
	)
}

export default FolderList
