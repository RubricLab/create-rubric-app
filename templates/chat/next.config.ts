import type { NextConfig } from 'next'

export default {
	reactStrictMode: true,
	transpilePackages: [
		'@rubriclab/auth',
		'@rubriclab/webhooks',
		// '@rubriclab/actions',
		// '@rubriclab/blocks',
		'@rubriclab/agents',
		'@rubriclab/events'
		// '@rubriclab/chains',
		// '@rubriclab/shapes'
	]
} satisfies NextConfig
