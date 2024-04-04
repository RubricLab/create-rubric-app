import {createEnv} from '@t3-oss/env-nextjs'
import z from 'zod'

export const env = createEnv({
	client: {
		NEXT_PUBLIC_URL: z.string().url()
	},
	server: {
		OPENAI_API_KEY: z.string().min(1),
		DATABASE_URL: z.string().min(1),
		NODE_ENV: z.string(),
		NEXTAUTH_SECRET: z.string(),
		GITHUB_ID: z.string(),
		GITHUB_SECRET: z.string(),
		S3_ACCESS_KEY: z.string(),
		S3_SECRET_KEY: z.string(),
		S3_REGION: z.string(),
		S3_BUCKET: z.string()
	},
	runtimeEnv: {
		NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,

		OPENAI_API_KEY: process.env.OPENAI_API_KEY,
		DATABASE_URL: process.env.DATABASE_URL,
		NODE_ENV: process.env.NODE_ENV,
		NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
		GITHUB_ID: process.env.GITHUB_ID,
		GITHUB_SECRET: process.env.GITHUB_SECRET,
		S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
		S3_SECRET_KEY: process.env.S3_SECRET_KEY,
		S3_REGION: process.env.S3_REGION,
		S3_BUCKET: process.env.S3_BUCKET
	}
})
