#! /usr/bin/env bun

import child_process, { spawn } from 'node:child_process'
import fs, { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import https from 'node:https'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import { checkbox, input, select } from '@inquirer/prompts'
import boxen from 'boxen'
import chalk from 'chalk'
import clear from 'clear'
import figlet from 'figlet'
import open from 'open'

const __filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename)

const CURR_DIR = process.cwd()

// Gets the native commands, e.g. `cp` or `copy` depending on the platform
function getPlatformNativeCmds(platform: 'win32' | string) {
	switch (platform) {
		case 'win32':
			return {
				copy: 'copy',
				move: 'move'
			}
		default:
			return {
				copy: 'cp',
				move: 'mv'
			}
		//TODO: add more platforms & relevant commands
	}
}

const PLC = getPlatformNativeCmds(process.platform)

function createDirectoryContents(templatePath: string, newProjectPath: string) {
	const filesToCreate = readdirSync(templatePath)

	for (const file of filesToCreate) {
		const origFilePath = `${templatePath}/${file}`

		// get stats about the current file
		const stats = statSync(origFilePath)

		if (stats.isFile()) {
			const contents = readFileSync(origFilePath, 'utf8')

			const writePath = `${CURR_DIR}/${newProjectPath}/${file}`
			writeFileSync(writePath, contents, 'utf8')
		} else if (stats.isDirectory()) {
			mkdirSync(`${CURR_DIR}/${newProjectPath}/${file}`)

			// recursive call
			createDirectoryContents(`${templatePath}/${file}`, `${newProjectPath}/${file}`)
		}
	}
}

function copyTemplate(name: string, template: string) {
	const projectName = name
	const templatePath = `${__dirname}/templates/${template}`

	mkdirSync(`${CURR_DIR}/${projectName}`)

	createDirectoryContents(templatePath, projectName)
}

async function _downloadFile(url: string, dest: string) {
	if (!fs.existsSync(dest)) mkdirSync(dest)
	const file = fs.createWriteStream(`${dest}/${path.basename(url)}`)
	return await new Promise<void>(resolve => {
		https.get(url, response => {
			response.pipe(file)

			// after download completed close filestream
			file.on('finish', () => {
				file.close()
				console.log(`Downloaded ${path.basename(url)}`)
				resolve()
			})
		})
	})
}

const {
	values: {
		name: _name,
		template: _template,
		yes: _yes,
		// verbose: _verbose,
		key: _key,
		ai: _ai,
		blank: _blank,
		bun: _bun
	}
} = parseArgs({
	options: {
		ai: {
			type: 'boolean'
		},
		blank: {
			type: 'boolean'
		},
		bun: {
			short: 'b',
			type: 'boolean'
		},
		// verbose: {
		// 	short: 'v',
		// 	type: 'boolean'
		// },
		key: {
			short: 'k',
			type: 'string'
		},
		name: {
			short: 'n',
			type: 'string'
		},
		template: {
			short: 't',
			type: 'string'
		},
		yes: {
			short: 'y',
			type: 'boolean'
		}
	}
})

clear()

console.log(
	boxen(
		chalk.bold(
			`Welcome to \n${chalk(
				figlet.textSync('Create Rubric App', {
					font: 'Small',
					horizontalLayout: 'default',
					verticalLayout: 'default'
				})
			)}`
		),
		{
			borderStyle: 'round',
			padding: 1
		}
	)
)

const CHOICES = readdirSync(`${__dirname}/templates`).map((template: string) => ({
	name: template,
	value: template
}))

let name =
	_name ||
	(_yes
		? 'jarvis'
		: await input({
				default: 'jarvis',
				message: 'What do you want to name your project?'
			}))

if (fs.existsSync(name)) {
	let i = 1
	while (fs.existsSync(`${name}-${i}`)) i++
	name = `${name}-${i}`
}

const template =
	_template ||
	(_yes
		? 'agent'
		: _ai
			? 'agent'
			: _blank
				? 'blank'
				: await select({
						choices: CHOICES,
						default: 'blank',
						message: 'What project template would you like to generate?'
					}))

const key =
	_key ||
	(await input({
		default: 'sk-XXX',
		message:
			'What is your Open AI API key? (\u001b]8;;https://platform.openai.com/account/api-keys\u0007Generate one here\u001b]8;;\u0007)'
	}))
// TODO: Ideally -> store default key in rubric.rc file in ~

const settings = _yes
	? _bun
		? ['scaffold', 'download', 'vscode', 'install', 'db', 'bun', 'dev']
		: ['scaffold', 'download', 'vscode', 'install', 'db', 'dev']
	: await checkbox({
			choices: [
				{ checked: _bun, name: 'use bun instead of npm', value: 'bun' },
				{ checked: true, name: 'scaffold project files', value: 'scaffold' },
				{ checked: true, name: 'download assets', value: 'download' },
				{ checked: true, name: 'configure vscode', value: 'vscode' },
				{ checked: true, name: 'configure DB', value: 'db' },
				{ checked: true, name: 'run install', value: 'install' },
				{ checked: true, name: 'run dev', value: 'dev' }
			],
			message: 'Do you want to change any settings?'
		})

if (settings.includes('scaffold')) {
	copyTemplate(name, template)
	console.log('✅ 1/6 - Scaffolded project files')
	child_process.execSync(
		`cd ${name} && ${PLC.copy} .env.example .env && echo ${key} >> .env && ${PLC.move} gitignore .gitignore && git init -b main`,
		{ stdio: [0, 1, 2] }
	)
} else console.log('✅ 1/6 - no-scaffold flag passed')

if (settings.includes('download'))
	if (template === 'agent')
		// await downloadFile(
		// 	'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700&display=swap',
		// 	`${name}/public/fonts`
		// )
		console.log('✅ 2/6 - Downloaded assets')
	else console.log('✅ 2/5 - Nothing to download')
else console.log('✅ 2/6 - no-download flag passed')

if (settings.includes('install')) {
	child_process.execSync(`cd ${name} && ${settings.includes('bun') ? 'bun i' : 'npm i'}`, {
		stdio: [0, 1, 2]
	})
	console.log(`✅ 3/6 - Installed dependencies with ${settings.includes('bun') ? 'bun' : 'npm'}`)
} else console.log('✅ 3/6 - no-install flag passed')

if (settings.includes('db')) {
	child_process.execSync(
		`cd ${name} && ${settings.includes('bun') ? 'bun db:dev:push' : 'npm run db:dev:push'}`,
		{ stdio: [0, 1, 2] }
	)
	console.log('✅ 4/6 - Configured DB with sqlite3')
} else console.log('✅ 4/6 - no-db flag passed')

if (settings.includes('vscode'))
	try {
		child_process.execSync('code --install-extension biomejs.biome --force', {
			stdio: [0, 1, 2]
		})
		child_process.execSync(`code ${name}`, { stdio: [0, 1, 2] })
		console.log('✅ 5/6 - Configured vscode')
	} catch (_e) {
		console.log(
			'❌ 5/6 - Could not configure vscode. You might have to do this: https://code.visualstudio.com/docs/setup/mac'
		)
	}
else console.log('✅ 5/6 - no-vscode flag passed')

if (settings.includes('dev'))
	await Promise.all([
		new Promise<void>(resolve => {
			setTimeout(() => {
				resolve()
			}, 2000)
		}).then(() => {
			open('http://localhost:3000')
			console.log('✅ 6/6 - Started development server')

			console.log(
				boxen(
					chalk(
						figlet.textSync('Happy Hacking!', {
							font: 'Small',
							horizontalLayout: 'default',
							verticalLayout: 'default'
						})
					),
					{
						borderStyle: 'round',
						padding: 1
					}
				)
			)
		}),
		spawn('cd', [name, '&&', settings.includes('bun') ? 'bun' : 'npm', 'run', 'dev'], {
			shell: true,
			stdio: 'inherit'
		})
	])
else console.log('✅ 6/6 - no-dev flag passed')
