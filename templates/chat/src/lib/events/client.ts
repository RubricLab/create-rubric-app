import { createEventsClient } from '@rubriclab/events/client'
import { eventTypes } from '~/events/types'

export const { useEvents } = createEventsClient({
	eventTypes,
	url: '/api/events'
})
