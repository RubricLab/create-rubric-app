import type { Module } from '~/types'

export const AgentModule: Module = {
	description: 'Agent (AI-powered tools for your app)',
	npmDependencies: { '@rubriclab/agents': '*' },
	moduleDependencies: ['EventsModule'],
	env: {
		OPENAI_API_KEY: 'string'
	}
}
