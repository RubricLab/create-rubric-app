import { createEventsClient } from '@rubriclab/events/client'
import { eventTypes } from '.'

export const { useEvents } = createEventsClient({
	eventTypes,
	url: '/api/events'
})
