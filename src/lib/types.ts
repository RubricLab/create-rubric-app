import type { Route } from '@rubriclab/ui'
import type { Modules } from './modules'
import type { InfrastructureOptions } from './providers'
import type { ZodMapKey } from './utils/env'

export type Config = {
	githubOrg: string
	githubToken: string
	upstashApiKey: string
	upstashEmail: string
	vercelApiKey: string
	vercelTeamId: string
	neonApiKey: string
	resendApiKey: string
	deploy: boolean
	openaiApiKey: string
}

export type NpmDependencies = Record<string, string>
export type NpmScripts = Record<string, string>

export interface Module {
	description: string
	templateDir?: string
	npmDependencies?: NpmDependencies
	npmDevDependencies?: NpmDependencies
	npmScripts?: NpmScripts
	moduleDependencies?: (keyof Modules)[]
	infrastructureDependencies?: (keyof InfrastructureOptions)[]
	env?: Record<string, ZodMapKey>
	routes?: Route[]
}
