#!/usr/bin/env bun

import { Command } from 'commander'
import { config } from '~/commands/config'
import { init } from '~/commands/init'

const program = new Command()

program
	.name('create-rubric-app')
	.description('CLI to create and deploy Rubric apps')
	.version('0.0.0')

program
	.command('config')
	.description('Configure your API keys and default settings')
	.action(() => {
		config({})
	})

program
	.command('init')
	.description('Initialize a new Rubric project')
	.option('-n, --name <name>', 'Project name')
	.action(init)

program.parse(process.argv)
