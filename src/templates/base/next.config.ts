import type { NextConfig } from 'next'

export default {
	transpilePackages: [
		'@rubriclab/auth',
		'@rubriclab/webhooks',
		'@rubriclab/actions',
		'@rubriclab/blocks'
	],
	reactStrictMode: true
} satisfies NextConfig
