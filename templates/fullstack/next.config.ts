import type { NextConfig } from 'next'

export default {
	images: {
		domains: [`${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com`]
	},
	reactStrictMode: true
} satisfies NextConfig
