/**
 * This file is the entry point for the React app, it sets up the root
 * element and renders the App component to the DOM.
 *
 * It is included in `src/internals/index.html`.
 */

import { createRoot } from 'react-dom/client'
import { App } from './App'

function start() {
	const rootElement = document.getElementById('root')
	if (!rootElement) throw new Error('Root element not found')
	const root = createRoot(rootElement)
	root.render(<App />)
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', start)
} else {
	start()
}
