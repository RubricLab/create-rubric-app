import { log } from '~/utils/log'

export async function provisionUpstashRedisDatabase({
	upstashEmail,
	upstashApiKey,
	databaseName
}: { upstashEmail: string; upstashApiKey: string; databaseName: string }) {
	log.info('Provisioning Redis DB...')

	const url = 'https://api.upstash.com/v2/redis/database'

	const auth = Buffer.from(`${upstashEmail}:${upstashApiKey}`).toString('base64')

	const body = {
		name: databaseName,
		region: 'global',
		primary_region: 'us-east-1',
		read_regions: ['us-west-1', 'us-west-2'],
		tls: true
	}

	const response = await fetch(url, {
		method: 'POST',
		headers: {
			Authorization: `Basic ${auth}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	})

	const data = await response.json()

	if (!response.ok) {
		throw 'error provisioning redis database on upstash'
	}

	const { password, endpoint, port } = data

	const connectionString = `rediss://default:${password}@${endpoint}:${port}`

	return connectionString
}
