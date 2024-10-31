import { log } from '~/utils/log'

export async function deployVercelProject({
	vercelApiKey,
	vercelTeamId,
	githubRepo,
	projectName,
	environmentVariables
}: {
	vercelApiKey: string
	vercelTeamId: string
	githubRepo: string
	projectName: string
	environmentVariables?: Record<string, string>
}) {
	log.info(`Deploying ${githubRepo} to vercel...`)

	const response = await fetch(`https://api.vercel.com/v10/projects?teamId=${vercelTeamId}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${vercelApiKey}`
		},
		body: JSON.stringify({
			name: projectName,
			gitRepository: {
				type: 'github',
				repo: githubRepo
			},
			environmentVariables: environmentVariables
				? Object.entries(environmentVariables).map(([k, v]) => ({
						key: k,
						target: 'production',
						type: 'plain',
						value: v
					}))
				: undefined
		})
	})

	const data = await response.json()

	if (!response.ok) {
		log.error(data)
		throw 'error deploying to vercel'
	}

	return data.id
}
