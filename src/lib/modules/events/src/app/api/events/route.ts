import { createEventsHandler } from '@rubriclab/events'
import { env } from '~/env'

export const maxDuration = 300

export const { eventsHandler: GET } = createEventsHandler({ redisURL: env.REDIS_URL })
