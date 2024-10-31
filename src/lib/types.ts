import type { Modules } from './modules'
import type { InfrastructureOptions } from './providers'

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
}

export type NpmDependency = Record<string, string>

export interface Module {
	description: string
	templateDir?: string
	npmDependencies?: NpmDependency[]
	npmDevDependencies?: NpmDependency[]
	moduleDependencies?: (keyof Modules)[]
	infrastructureDependencies?: (keyof InfrastructureOptions)[]
}
