import type { createEnv } from '@t3-oss/env-nextjs'

type CreateEnvParams = Parameters<typeof createEnv>[0]

const zodTypeMap = {
	string: 'z.string().min(1)',
	number: 'z.number().min(1)',
	boolean: 'z.boolean()'
}

export type ZodMapKey = keyof typeof zodTypeMap

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const envSchema: Record<string, any> = {
	server: {},
	client: {},
	runtimeEnv: {}
} satisfies CreateEnvParams

export async function writeEnv({
	projectDirectory,
	envDependencies,
	env
}: {
	projectDirectory: string
	envDependencies: Record<string, ZodMapKey>
	env: Record<string, string>
}) {
	// Create .env
	const dotEnvFile = Bun.file(`${projectDirectory}/.env`)
	await Bun.write(
		dotEnvFile,
		Object.entries(env)
			.map(([key, value]) => `${key}="${value}"`)
			.join('\n')
	)

	// Create env.ts
	for (const [key, value] of Object.entries(envDependencies)) {
		envSchema.server[key] = zodTypeMap[value]
		envSchema.runtimeEnv[key] = `process.env.${key}`
	}

	await Bun.write(
		`${projectDirectory}/src/lib/env.ts`,
		`
			import { createEnv } from '@t3-oss/env-nextjs'
			import { z } from 'zod'

			export const env = createEnv({
				${Object.entries(envSchema)
					.map(
						([sectionName, sectionObj]) =>
							`${sectionName}: {${Object.entries(sectionObj)
								.map(([key, value]) => `${key}: ${value}`)
								.join(',\n')}}`
					)
					.join(',\n')}
			})
		`
	)
}
