import type { Module } from '~/types'

export const EmailModule: Module = {
	description: '',
	npmDependencies: { resend: 'latest' },
	env: {
		RESEND_API_KEY: 'string'
	}
}
