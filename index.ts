#! /usr/bin/env bun

import { existsSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { createCLI, createCommand } from '@rubriclab/cli'
import { $ } from 'bun'
import { z } from 'zod'

const templates = readdirSync(path.join(import.meta.dir, 'templates'))

const initCommand = createCommand({
	args: z.object({
		name: z.string().default('my-app').describe('Name of the new app directory'),
		template: z.enum(templates).default('react').describe('Template to use for the new app')
	}),
	description: 'Inits an app based on Rubric patterns',
	handler: async ({ name, template }) => {
		const targetDir = path.join(process.cwd(), name)
		const templateDir = path.join(import.meta.dir, 'templates', template)

		if (existsSync(targetDir)) {
			console.error(`Error: Directory "${name}" already exists`)
			process.exit(1)
		}

		await $`cp -r ${templateDir} ${targetDir}`
		console.log(`✅ Successfully created "${name}" from Rubric chat template`)
		console.log('\nNext steps:')
		console.log(`  cd ${name}`)
		console.log('  bun install')
		console.log('  bun dev')
	},
	name: 'init'
})

const cli = createCLI({
	commands: [initCommand],
	description: 'Create a new Rubric app',
	name: 'create-rubric-app',
	version: '1.0.0'
})

cli.parse()
