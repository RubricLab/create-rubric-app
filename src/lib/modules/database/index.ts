import type { Module } from '~/types'

export const DatabaseModule: Module = {
	description: 'Database ()',
	templateDir: 'templates/database',
	npmDevDependencies: { prisma: 'latest' },
	npmDependencies: { '@prisma/client': 'latest' },
	npmScripts: {
		'db:push': 'prisma db push --schema src/schema',
		'db:generate': 'prisma generate --schema src/schema',
		postinstall: 'bun db:generate',
		prepare: 'bun db:push'
	},
	infrastructureDependencies: ['postgres'],
	env: {
		DATABASE_URL: 'string'
	}
}
