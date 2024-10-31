import { homedir } from 'node:os'
import { join } from 'node:path'
import { config } from '~/commands/config'
import type { Config } from '~/types'

const CONFIG_DIR = join(homedir(), '.create-rubric-app')
const CONFIG_PATH = join(CONFIG_DIR, 'config.json')

async function loadConfig(): Promise<Partial<Config>> {
	try {
		const configContent = await Bun.file(CONFIG_PATH).text()
		return JSON.parse(configContent)
	} catch {
		return {}
	}
}

export async function saveConfig(config: Partial<Config>) {
	const configToSave = Object.fromEntries(
		Object.entries(config).filter(([_, value]) => value !== '')
	)
	await Bun.write(CONFIG_PATH, JSON.stringify(configToSave, null, 2))
}

// Define a type guard to check if currentConfig has all required keys
function hasRequiredKeys<T extends keyof Config>(
	config: Partial<Config>,
	keys: T[]
): config is Partial<Config> & Pick<Config, T> {
	return keys.every(key => key in config)
}

export async function checkConfig<T extends keyof Config>({
	required
}: {
	required: T[]
}): Promise<Partial<Config> & Pick<Config, T>> {
	const currentConfig = await loadConfig()
	const missingKeys = required.filter(key => !currentConfig[key])

	if (missingKeys.length) {
		const newConfig = await config({ required: missingKeys })
		const updatedConfig = { ...currentConfig, ...newConfig }
		await saveConfig(updatedConfig)
		return updatedConfig as Partial<Config> & Pick<Config, T>
	}

	if (hasRequiredKeys(currentConfig, required)) {
		return currentConfig
	}

	throw new Error('Required configuration keys are missing')
}
