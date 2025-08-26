import { createEventTypes } from '@rubriclab/events'
import { todoAgentEventTypes } from '~/agents/todo'

export const eventTypes = createEventTypes({
	...todoAgentEventTypes
})
