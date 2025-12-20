import { createEventsServer } from '@rubriclab/events/server'
import env from '~/env'
import { eventTypes } from '~/events/types'

export const { publish, GET, maxDuration } = createEventsServer({
	eventTypes,
	redisURL: env.REDIS_URL
})
