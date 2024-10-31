import { provisionNeonDatabase } from './neon'
import { provisionUpstashRedisDatabase } from './upstash'

export const infrastructureOptions = {
	postgres: provisionNeonDatabase,
	redis: provisionUpstashRedisDatabase
}

export type InfrastructureOptions = typeof infrastructureOptions
