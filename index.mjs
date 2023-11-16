#! /usr/bin/env node

import {checkbox, input, select} from '@inquirer/prompts'
import boxen from 'boxen'
import chalk from 'chalk'
import child_process from 'child_process'
import clear from 'clear'
import figlet from 'figlet'
import fs, {
	mkdirSync,
	readFileSync,
	readdirSync,
	statSync,
	writeFileSync
} from 'fs'
import https from 'https'
import {parseArgs} from 'node:util'
import open from 'open'
import path from 'path'
import {fileURLToPath} from 'url'

const __filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename)

const CURR_DIR = process.cwd()

// Gets the native commands, e.g. `cp` or `copy` depending on the platform
function getPlatformNativeCmds(platform) {
	switch (platform) {
		case 'win32':
			return {
				copy: 'copy',
				move: 'move',
			}
		default:
			return {
				copy: 'cp',
				move: 'mv',
			}
		//TODO: add more platforms & relevant commands
	}
}

const PLC = getPlatformNativeCmds(process.platform)

function createDirectoryContents(templatePath, newProjectPath) {
	const filesToCreate = readdirSync(templatePath)

	filesToCreate.forEach(file => {
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
			createDirectoryContents(
				`${templatePath}/${file}`,
				`${newProjectPath}/${file}`
			)
		}
	})
}

function copyTemplate(name, template) {
	const projectName = name
	const templatePath = `${__dirname}/templates/${template}`

	mkdirSync(`${CURR_DIR}/${projectName}`)

	createDirectoryContents(templatePath, projectName)
}

async function downloadFile(url, dest) {
	if (!fs.existsSync(dest)) mkdirSync(dest)
	const file = fs.createWriteStream(`${dest}/${path.basename(url)}`)
	return await new Promise(resolve => {
		https.get(url, function (response) {
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
		bun: _bun
	}
} = parseArgs({
	options: {
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
		},
		// verbose: {
		// 	short: 'v',
		// 	type: 'boolean'
		// },
		key: {
			short: 'k',
			type: 'string'
		},
		ai: {
			type: 'boolean'
		},
		bun: {
			short: 'b',
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

const CHOICES = readdirSync(`${__dirname}/templates`).map(template => ({
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
		: await select({
				choices: CHOICES,
				default: 'agent',
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
				{checked: true, name: 'scaffold project files', value: 'scaffold'},
				{checked: true, name: 'download assets', value: 'download'},
				{checked: true, name: 'configure vscode', value: 'vscode'},
				{checked: true, name: 'configure DB', value: 'db'},
				{checked: true, name: 'run install', value: 'install'},
				{checked: true, name: 'run dev', value: 'dev'},
				{checked: _bun, name: 'use bun instead of npm', value: 'bun'}
			],
			message: 'Do you want to change any settings?'
	  })

if (settings.includes('scaffold')) {
	copyTemplate(name, template)
	console.log(`✅ 1/6 - Scaffolded project files`)
	child_process.execSync(
		`cd ${name} && ${PLC.copy} .env.example .env && echo ${key} >> .env && ${PLC.move} gitignore .gitignore && git init -b main`,
		{stdio: [0, 1, 2]}
	)
} else console.log(`✅ 1/6 - no-scaffold flag passed`)

if (settings.includes('download'))
	if (template === 'agent')
		// await downloadFile(
		// 	'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700&display=swap',
		// 	`${name}/public/fonts`
		// )
		console.log(`✅ 2/6 - Downloaded assets`)
	else console.log(`✅ 2/5 - Nothing to download`)
else console.log(`✅ 2/6 - no-download flag passed`)

if (settings.includes('install')) {
	child_process.execSync(
		`cd ${name} && ${settings.includes('bun') ? 'bun i' : 'npm i'}`,
		{stdio: [0, 1, 2]}
	)
	console.log(
		`✅ 3/6 - Installed dependencies with ${
			settings.includes('bun') ? 'bun' : 'npm'
		}`
	)
} else console.log(`✅ 3/6 - no-install flag passed`)

if (settings.includes('db')) {
	child_process.execSync(
		`cd ${name} && ${
			settings.includes('bun') ? 'bun db:dev:push' : 'npm run db:dev:push'
		}`,
		{stdio: [0, 1, 2]}
	)
	console.log(`✅ 4/6 - Configured DB with sqlite3`)
} else console.log(`✅ 4/6 - no-db flag passed`)

if (settings.includes('vscode'))
	try {
		child_process.execSync('code --install-extension dbaeumer.vscode-eslint', {
			stdio: [0, 1, 2]
		})
		child_process.execSync('code --install-extension esbenp.prettier-vscode', {
			stdio: [0, 1, 2]
		})
		child_process.execSync(`code ${name}`, {stdio: [0, 1, 2]})
		console.log(`✅ 5/6 - Configured vscode`)
	} catch (e) {
		console.log(
			`❌ 5/6 - Could not configure vscode. You might have to do this: https://code.visualstudio.com/docs/setup/mac`
		)
	}
else console.log(`✅ 5/6 - no-vscode flag passed`)

if (settings.includes('dev'))
	await Promise.all([
		new Promise(resolve => {
			setTimeout(() => {
				resolve()
			}, 2000)
		}).then(() => {
			open(`http://localhost:3000`)
			console.log(`✅ 6/6 - Started development server`)

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
		child_process.exec(
			`cd ${name} && ${settings.includes('bun') ? 'bun' : 'npm run'} dev`,
			{stdio: [0, 1, 2]}
		)
	])
else console.log(`✅ 6/6 - no-dev flag passed`)
