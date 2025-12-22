import { eventTypes } from '~/events'
import '../globals.css'
import { createEventsClient } from '@rubriclab/events/client'

const { useEvents } = createEventsClient({
	eventTypes,
	url: '/api/events'
})

export function App() {
	useEvents({
		id: '0',
		on: {
			ping: console.log
		}
	})

	return (
		<div className="flex h-screen items-center justify-center">
			<h1>hello world</h1>
		</div>
	)
}

export default App
