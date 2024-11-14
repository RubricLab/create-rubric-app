import type { Module } from '~/types'

export const EventsModule: Module = {
	description: 'Events (pub/sub for your app)',
	npmDependencies: { '@rubriclab/events': '*' },
	infrastructureDependencies: ['redis']
}
