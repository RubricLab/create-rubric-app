import type { InfrastructureOptions } from '~/providers'
import { AuthModule } from './auth'
import { DatabaseModule } from './database'
import { EmailModule } from './email'

export const modulesOptions = { AuthModule, DatabaseModule, EmailModule }
export type Modules = typeof modulesOptions

export function getModuleDependencies({ modules }: { modules: (keyof Modules)[] }) {
	const collectedModules = new Set<keyof Modules>()
	const npmDependencies: Record<string, string> = {}
	const npmDevDependencies: Record<string, string> = {}
	const infrastructureDependencies = new Set<keyof InfrastructureOptions>()

	const collect = (moduleName: keyof Modules) => {
		if (collectedModules.has(moduleName)) return
		collectedModules.add(moduleName)
		const module = modulesOptions[moduleName]

		module.npmDependencies?.map(dep => {
			Object.assign(npmDependencies, dep)
		})
		module.npmDevDependencies?.map(devDep => {
			Object.assign(npmDevDependencies, devDep)
		})
		module.infrastructureDependencies?.map(infraDep => {
			infrastructureDependencies.add(infraDep)
		})

		module.moduleDependencies?.forEach(collect)
	}

	modules.forEach(collect)

	return {
		modules: Array.from(collectedModules),
		npmDependencies,
		npmDevDependencies,
		infrastructureDependencies: Array.from(infrastructureDependencies)
	}
}
