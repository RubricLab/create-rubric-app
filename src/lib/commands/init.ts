import { prompt } from 'inquirer'
import { getModuleDependencies, modulesOptions } from '~/modules'
import { provisionNeonDatabase } from '~/providers/neon'
import { provisionUpstashRedisDatabase } from '~/providers/upstash'
import { deployVercelProject } from '~/providers/vercel'
import { checkConfig } from '~/utils/config'
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

	const { npmDependencies, npmDevDependencies, infrastructureDependencies } = getModuleDependencies({
		modules
	})

	packageJSON.dependencies = { ...packageJSON.dependencies, ...npmDependencies }
	packageJSON.devDependencies = { ...packageJSON.devDependencies, ...npmDevDependencies }

	await writePackageJSON({ projectDirectory: projectSlug, json: packageJSON })

	if (infrastructureDependencies.includes('postgres')) {
		const { neonApiKey } = await checkConfig({ required: ['neonApiKey'] })
		await provisionNeonDatabase({
			neonApiKey,
			projectName: projectSlug
		})
	}

	if (infrastructureDependencies.includes('redis')) {
		const { upstashApiKey, upstashEmail } = await checkConfig({
			required: ['upstashApiKey', 'upstashEmail']
		})
		await provisionUpstashRedisDatabase({
			upstashApiKey,
			upstashEmail,
			databaseName: projectSlug
		})
	}

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
			projectName: projectSlug
		})
		await commit({
			org: githubOrg,
			repo: `${projectSlug}`,
			projectDirectory: projectSlug
		})
	}

	log.success('FTW')
}
