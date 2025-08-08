import { createEnv } from '@t3-oss/env-nextjs'
import z from 'zod'

export const env = createEnv({
	client: {},
	runtimeEnv: {
		DATABASE_URL: process.env.DATABASE_URL,
		NODE_ENV: process.env.NODE_ENV,
		OPENAI_API_KEY: process.env.OPENAI_API_KEY
	},
	server: {
		DATABASE_URL: z.string().min(1),
		NODE_ENV: z.string(),
		OPENAI_API_KEY: z.string().min(1)
	}
})
