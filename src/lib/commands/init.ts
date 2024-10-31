import { $ } from 'bun'
import { prompt } from 'inquirer'
import { getModuleDependencies, modulesOptions } from '~/modules'
import { provisionNeonDatabase } from '~/providers/neon'
import { provisionUpstashRedisDatabase } from '~/providers/upstash'
import { deployVercelProject } from '~/providers/vercel'
import { checkConfig } from '~/utils/config'
import { writeEnv } from '~/utils/env'
import { copyDir, getPackageJSON, writePackageJSON } from '~/utils/file'
import { log } from '~/utils/log'
import { commit, createRepo, install, run } from '~/utils/setup'

export async function init(cmd: { name?: string }) {
	const projectName =
		cmd.name ||
		(await prompt({
			type: 'input',
			name: 'name',
			message: 'What is the name of your project?',
			validate: (input: string) => (input.trim().length === 0 ? 'Project name cannot be empty' : true)
		}).then(answers => answers.name))

	const projectSlug = projectName.toLowerCase().replace(/\s+/g, '_')

	log.info(`Initializing new project: ${projectName}`)

	await copyDir({ source: 'templates/base', destination: projectSlug })

	const packageJSON = await getPackageJSON({ projectDirectory: projectSlug })

	const { modules } = await prompt([
		{
			type: 'checkbox',
			name: 'modules',
			message: 'Select modules to include:',
			choices: Object.entries(modulesOptions).map(([key, { description }]) => ({
				name: description,
				value: key
			})),
			validate: (input: string[]) => (input.length > 0 ? true : 'Please select at least one module.')
		}
	])

	const {
		npmDependencies,
		npmDevDependencies,
		infrastructureDependencies,
		env: envDependencies
	} = getModuleDependencies({
		modules
	})

	// TODO: boil this
	const modulesPath = 'src/lib/modules/'
	const moduleFiles = (await $`find ${modulesPath} -type f`.text()).split('\n').filter(Boolean)
	const modulePaths = moduleFiles.map(f => f.replace(modulesPath, '').split('/').slice(2).join('/'))

	for (let i = 0; i < moduleFiles.length; i++) {
		if (!modulePaths[i] || modulePaths[i] === '/index.ts') continue
		const filename = moduleFiles[i]
		if (!filename) continue
		const file = Bun.file(filename)
		console.log(modulePaths[i])

		await Bun.write(`${projectSlug}/${modulePaths[i]}`, await file.text())
	}

	packageJSON.dependencies = { ...packageJSON.dependencies, ...npmDependencies }
	packageJSON.devDependencies = { ...packageJSON.devDependencies, ...npmDevDependencies }

	await writePackageJSON({ projectDirectory: projectSlug, json: packageJSON })

	const env: Record<string, string> = {}

	if (infrastructureDependencies.includes('postgres')) {
		const { neonApiKey } = await checkConfig({ required: ['neonApiKey'] })
		env.DATABASE_URL = await provisionNeonDatabase({
			neonApiKey,
			projectName: projectSlug
		})
	}

	if (infrastructureDependencies.includes('redis')) {
		const { upstashApiKey, upstashEmail } = await checkConfig({
			required: ['upstashApiKey', 'upstashEmail']
		})
		env.REDIS_URL = await provisionUpstashRedisDatabase({
			upstashApiKey,
			upstashEmail,
			databaseName: projectSlug
		})
	}

	await writeEnv({ projectDirectory: projectSlug, envDependencies, env })

	await install({ projectDirectory: projectSlug })

	await run({ projectDirectory: projectSlug })

	const { deploy } = await checkConfig({ required: ['deploy'] })

	if (deploy) {
		const { vercelApiKey, vercelTeamId, githubOrg, githubToken } = await checkConfig({
			required: ['vercelApiKey', 'vercelTeamId', 'githubOrg', 'githubToken']
		})
		await createRepo({
			githubToken,
			org: githubOrg,
			repo: `${projectSlug}`
		})
		await deployVercelProject({
			vercelApiKey: vercelApiKey,
			vercelTeamId: vercelTeamId,
			githubRepo: `${githubOrg}/${projectSlug}`,
			projectName: projectSlug,
			environmentVariables: env
		})
		await commit({
			org: githubOrg,
			repo: `${projectSlug}`,
			projectDirectory: projectSlug
		})
	}

	log.success('FTW')
}
