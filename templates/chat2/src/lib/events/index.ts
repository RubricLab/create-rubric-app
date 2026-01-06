import { createEventTypes } from '@rubriclab/events'
import { z } from 'zod'

export const eventTypes = createEventTypes({
	message: z.object({
		content: z.string(),
		id: z.string(),
		role: z.enum(['user', 'assistant'])
	})
})
