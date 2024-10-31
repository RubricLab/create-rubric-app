import { Octokit } from '@octokit/rest'
import { $ } from 'bun'
import open from 'open'
import { log } from './log'

export async function install({ projectDirectory }: { projectDirectory: string }) {
	log.info('Installing dependencies...')

	await $`cd ${projectDirectory} && bun i`.quiet()

	log.info('Bleeding packages, linting, formatting...')

	await $`cd ${projectDirectory} && bun bleed && bun lint:fix && bun format`.quiet()
}

export async function run({ projectDirectory }: { projectDirectory: string }) {
	const { stdout } = Bun.spawn({
		cmd: ['bun', 'dev'],
		cwd: projectDirectory
	})

	const reader = stdout.getReader()

	let port = '3000'

	while (true) {
		const { value } = await reader.read()
		const output = new TextDecoder().decode(value)
		// process.stdout.write(output)

		port = output.match(/localhost:(\d+)/)?.[1] ?? port

		if (output.includes('Ready in')) {
			open(`http://localhost:${port}`)
			break
		}
	}
}

export async function createRepo({
	org,
	repo,
	githubToken
}: { org: string; repo: string; githubToken: string }) {
	const octokit = new Octokit({ auth: githubToken })

	log.info(`Creating github repository: ${org}/${repo}...`)

	await octokit.repos.createInOrg({
		name: repo,
		private: true,
		org
	})
}

export async function commit({
	org,
	repo,
	projectDirectory
}: { org: string; repo: string; projectDirectory: string }) {
	await $`cd ${projectDirectory} && git add package.json`.quiet()
	await $`cd ${projectDirectory} && git init`.quiet()
	await $`cd ${projectDirectory} && git add .`.quiet()
	await $`cd ${projectDirectory} && git commit -m "Initial commit"`.quiet()
	await $`cd ${projectDirectory} && git branch -M main`.quiet()

	log.info(`Pushing to github repository: ${org}/${repo}...`)

	await $`cd ${projectDirectory} && git remote add origin https://github.com/${org}/${repo}.git`.quiet()
	await $`cd ${projectDirectory} && git push -u origin main`.quiet()
}
