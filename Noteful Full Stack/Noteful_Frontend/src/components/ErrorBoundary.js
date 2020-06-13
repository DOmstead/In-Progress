import React from 'react'
import PropTypes from 'prop-types'

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props)
		this.state = { hasError: false }
	}

	static getDerivedStateFromError(error) {
		return { hasError: true }
	}

	componentDidCatch(error, errorInfo) {
		console.log('An error has occured', error, errorInfo)
	}

	render() {
		if (this.state.hasError) {
			return <p>{this.props.message}</p>
		}
		return this.props.children
	}
}

ErrorBoundary.defaultProps = {
	message: 'Unable to process this request'
}

ErrorBoundary.propTypes = {
	message: PropTypes.string
}

export default ErrorBoundary
