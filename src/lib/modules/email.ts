import type { Module } from '~/types'

export const EmailModule: Module = {
	description: '',
	npmDependencies: [{ nodemailer: '^6.7.2' }],
	npmDevDependencies: [{ '@types/nodemailer': '^6.4.4' }]
}
