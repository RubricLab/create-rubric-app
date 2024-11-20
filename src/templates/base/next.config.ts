import type { NextConfig } from 'next'

export default {
	transpilePackages: [
		'@rubriclab/auth',
		'@rubriclab/webhooks',
		'@rubriclab/actions',
		'@rubriclab/blocks',
		'@rubriclab/agents',
		'@rubriclab/events'
	],
	reactStrictMode: true
} satisfies NextConfig
