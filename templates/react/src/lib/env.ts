import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export default createEnv({
	client: {
		PUBLIC_AUTH_URL: z.string().default('http://localhost:3000/api/auth')
	},
	clientPrefix: 'PUBLIC_',
	runtimeEnv: process.env,
	server: {
		DATABASE_URL: z.string().default('postgres://postgres:postgres@localhost:5432/app'),
		NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
		OPENAI_API_KEY: z.string().min(1),
		REDIS_URL: z.string().default('redis://localhost:6379')
	}
})
