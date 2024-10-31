import { prompt } from 'inquirer'
import type { Config } from '~/types'
import { saveConfig } from '~/utils/config'
import { log } from '~/utils/log'

export async function config({ required }: { required?: string[] }) {
	log.info('Welcome to the create-rubric-app configuration setup.')

	const allPrompts: {
		type: string
		name: keyof Config
		message: string
		mask?: string
		default?: undefined | boolean
	}[] = [
		{
			type: 'text',
			name: 'githubOrg',
			message: 'Enter your Github Org:',
			default: undefined
		},
		{
			type: 'password',
			name: 'githubToken',
			message: 'Enter your Github PAT:',
			mask: '*',
			default: undefined
		},
		{
			type: 'password',
			name: 'upstashApiKey',
			message: 'Enter your Upstash API key:',
			mask: '*',
			default: undefined
		},
		{
			type: 'email',
			name: 'upstashEmail',
			message: 'Enter your Upstash Email:',
			default: undefined
		},
		{
			type: 'password',
			name: 'vercelApiKey',
			message: 'Enter your Vercel API key:',
			mask: '*',
			default: undefined
		},
		{
			type: 'password',
			name: 'vercelTeamId',
			message: 'Enter your Vercel Team id:',
			default: undefined
		},
		{
			type: 'password',
			name: 'neonApiKey',
			message: 'Enter your Neon API key:',
			mask: '*',
			default: undefined
		},
		{
			type: 'password',
			name: 'resendApiKey',
			message: 'Enter your Resend API key:',
			mask: '*',
			default: undefined
		},
		{
			type: 'confirm',
			name: 'deploy',
			message: 'Enable automatic deployment with Vercel?',
			default: true
		}
	]

	const prompts = required ? allPrompts.filter(prompt => required.includes(prompt.name)) : allPrompts

	const answers = await prompt(prompts)

	const config = answers as Partial<Config>

	await saveConfig(config)

	log.success('Configuration saved successfully.')

	return config
}
