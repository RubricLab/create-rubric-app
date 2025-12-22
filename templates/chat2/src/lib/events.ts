import { createEventTypes } from '@rubriclab/events'
import { z } from 'zod'

export const eventTypes = createEventTypes({
	ping: z.literal('pong')
})
