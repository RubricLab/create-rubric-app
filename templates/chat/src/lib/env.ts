import { createEnv } from '@t3-oss/env-nextjs'
import z from 'zod'

export default createEnv({
	client: {
		NEXT_PUBLIC_AUTH_URL: z.string().min(1)
	},
	experimental__runtimeEnv: {
		NEXT_PUBLIC_AUTH_URL: process.env.NEXT_PUBLIC_AUTH_URL
	},
	server: {
		DATABASE_URL: z.string().min(1),
		GITHUB_CLIENT_ID: z.string().min(1),
		GITHUB_CLIENT_SECRET: z.string().min(1),
		NODE_ENV: z.string(),
		OPENAI_API_KEY: z.string().min(1),
		UPSTASH_REDIS_URL: z.string().min(1)
	}
})
