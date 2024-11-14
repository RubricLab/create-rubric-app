import type { Route } from '@rubriclab/ui'
import type { InfrastructureOptions } from '~/providers'
import type { ZodMapKey } from '~/utils/env'
import { AuthModule } from './auth'
import { DatabaseModule } from './database'
import { EmailModule } from './email'

export const modulesOptions = { AuthModule, DatabaseModule, EmailModule }
export type Modules = typeof modulesOptions

export function getModuleDependencies({ modules }: { modules: (keyof Modules)[] }) {
	const collectedModules = new Set<keyof Modules>()
	const npmDependencies: Record<string, string> = {}
	const npmDevDependencies: Record<string, string> = {}
	const routes: Route[] = []
	const npmScripts: Record<string, string> = {}
	const infrastructureDependencies = new Set<keyof InfrastructureOptions>()
	const env: Record<string, ZodMapKey> = {}

	const collect = (moduleName: keyof Modules) => {
		if (collectedModules.has(moduleName)) return
		collectedModules.add(moduleName)
		const module = modulesOptions[moduleName]

		Object.assign(npmDependencies, module.npmDependencies)
		Object.assign(npmDevDependencies, module.npmDevDependencies)
		Object.assign(npmScripts, module.npmScripts)
		routes.push(...(module.routes || []))

		module.infrastructureDependencies?.map(infraDep => {
			infrastructureDependencies.add(infraDep)
		})
		Object.assign(env, module.env)

		module.moduleDependencies?.forEach(collect)
	}

	modules.forEach(collect)

	return {
		modules: Array.from(collectedModules),
		npmDependencies,
		routes,
		npmDevDependencies,
		npmScripts,
		infrastructureDependencies: Array.from(infrastructureDependencies),
		env
	}
}
