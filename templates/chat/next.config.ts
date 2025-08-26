import type { NextConfig } from 'next'

export default {
	reactStrictMode: true,
	transpilePackages: [
		'@rubriclab/actions',
		'@rubriclab/agents',
		'@rubriclab/auth',
		'@rubriclab/blocks',
		'@rubriclab/chains',
		'@rubriclab/events',
		'@rubriclab/shapes',
		'@rubriclab/webhooks'
	]
} satisfies NextConfig
