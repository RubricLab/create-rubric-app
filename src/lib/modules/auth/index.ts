import type { Module } from '~/types'

export const AuthModule: Module = {
	description: 'Auth (User authentication and authorization)',
	npmDependencies: { '@rubriclab/auth': '*' },
	moduleDependencies: ['DatabaseModule', 'EmailModule'],
	env: {
		URL: 'string'
	}
}
