import type { Module } from '~/types'

export const DatabaseModule: Module = {
	description: 'Database ()',
	templateDir: 'templates/database',
	npmDevDependencies: [{ prisma: 'latest' }],
	npmDependencies: [{ '@prisma/client': 'latest' }],
	infrastructureDependencies: ['postgres']
}
