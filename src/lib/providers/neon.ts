import { createApiClient } from '@neondatabase/api-client'
import { log } from '~/utils/log'

export async function provisionNeonDatabase({
	neonApiKey,
	projectName
}: { neonApiKey: string; projectName: string }) {
	log.info('Provisioning Neon DB...')
	const apiClient = createApiClient({
		apiKey: neonApiKey
	})
	const project = await apiClient.createProject({ project: { name: projectName } })

	const connectionString = project.data.connection_uris[0]?.connection_uri

	if (!connectionString) throw 'No connection string returned from Neon'

	return connectionString
}
