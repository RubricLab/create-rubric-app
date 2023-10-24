#! /usr/bin/env node


import {checkbox, input, select} from '@inquirer/prompts'
import boxen from 'boxen'
import chalk from 'chalk'
import child_process from 'child_process'
import clear from 'clear'
import figlet from 'figlet'
import fs, {mkdirSync, readFileSync, readdirSync, statSync, writeFileSync} from 'fs'
import https from 'https'
import {parseArgs} from 'node:util'
import open from 'open'
import path from 'path'
import {fileURLToPath} from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const CURR_DIR = process.cwd()

const createDirectoryContents = (templatePath, newProjectPath) => {
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
			createDirectoryContents(`${templatePath}/${file}`, `${newProjectPath}/${file}`)
		}
	})
}

const copyTemplate = (name, template) => {
	const projectName = name
	const templatePath = `${__dirname}/templates/${template}`

	mkdirSync(`${CURR_DIR}/${projectName}`)

	createDirectoryContents(templatePath, projectName)
}

var downloadFile = async (url, dest) => {
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

// Parse arguments

const {
	values: {name: _name, yes: _yes, template: _template, dissent: _dissent}
} = parseArgs({
	options: {
		dissent: {
			short: 'x',
			type: 'boolean'
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
			`Welcome to \n${chalk.hex('#f97316')(
				figlet.textSync('Create Rubric App', {
					font: 'Small',
					horizontalLayout: 'default',
					verticalLayout: 'default'
				})
			)}`
		),
		{
			borderColor: '#f97316',
			borderStyle: 'round',
			padding: 1
		}
	)
)

const CHOICES = readdirSync(`${__dirname}/templates`).map(template => ({
	name: template,
	value: template
}))

const name = _name || (_yes ? 'my-app' : await input({default: 'my-app', message: 'What do you want to name your project?'}))
const template = _template || (_yes ? 'fullstack' : await select({choices: CHOICES, default: 'fullstack', message: 'What project template would you like to generate?'}))
const settings = _yes
	? ['scaffold', 'download', 'vscode', 'install', 'dev'] + (_dissent ? ['yarn'] : [])
	: await checkbox({
			choices: [
				{checked: true, name: 'scaffold project files', value: 'scaffold'},
				{checked: true, name: 'download assets', value: 'download'},
				{checked: true, name: 'configure vscode', value: 'vscode'},
				{checked: true, name: 'run install', value: 'install'},
				{checked: true, name: 'run dev', value: 'dev'},
				{checked: _dissent, name: 'use yarn', value: 'yarn'}
			],
			message: 'Do you want to change any settings?'
	  })

console.log(`Creating a new ${chalk.hex('#f97316')(template)} app called ${chalk.hex('#f97316')(name)}...`)

if (settings.includes('scaffold')) {
	copyTemplate(name, template)
	console.log(`✅ 1/5 - Scaffolded project files`)
} else console.log(`✅ 1/5 - no-scaffold flag passed`)

if (settings.includes('download'))
	if (template === 'fullstack') {
		await downloadFile('https://rubriclab.com/fonts/CalSans-SemiBold.ttf', `${name}/public/fonts`)
		console.log(`✅ 2/5 - Downloaded assets`)
	} else console.log(`✅ 2/5 - Nothing to download`)
else console.log(`✅ 2/5 - no-download flag passed`)

if (settings.includes('install')) {
	child_process.execSync(`cd ${name} && ${settings.includes('yarn') ? 'yarn' : 'bun i'}`, {stdio: [0, 1, 2]})
	console.log(`✅ 3/5 - Installed dependencies with ${settings.includes('yarn') ? 'yarn' : 'bun'}`)
} else console.log(`✅ 3/5 - no-install flag passed`)

if (settings.includes('vscode'))
	try {
		child_process.execSync('code --install-extension dbaeumer.vscode-eslint', {stdio: [0, 1, 2]})
		child_process.execSync('code --install-extension esbenp.prettier-vscode', {stdio: [0, 1, 2]})
		child_process.execSync(`code ${name}`, {stdio: [0, 1, 2]})
		console.log(`✅ 4/5 - Configured vscode`)
	} catch (e) {
		console.log(`❌ 4/5 - Could not configure vscode. You might have to do this: https://code.visualstudio.com/docs/setup/mac`)
	}
else console.log(`✅ 4/5 - no-vscode flag passed`)

if (settings.includes('dev'))
	await Promise.all([
		new Promise(resolve => {
			setTimeout(() => {
				resolve()
			}, 2000)
		}).then(() => {
			open(`http://localhost:3000`)
			console.log(`✅ 5/5 - Started development server`)
			!_dissent
				? console.log(
						boxen(
							chalk.hex('#f97316')(
								figlet.textSync('Happy Hacking!', {
									font: 'Small',
									horizontalLayout: 'default',
									verticalLayout: 'default'
								})
							),
							{
								borderColor: '#f97316',
								borderStyle: 'round',
								padding: 1
							}
						)
				  )
				: console.log(
						boxen(
							chalk.hex('#FDD41E')(
								figlet.textSync('RESIST!', {
									font: 'big',
									horizontalLayout: 'default',
									verticalLayout: 'default'
								})
							),
							{
								// align: 'center',
								// backgroundColor: 'black',
								// borderColor: 'black',
								borderStyle: 'round',

								borderStyle: {
									bottom: '👆',
									bottomLeft: ' ',
									bottomRight: ' ',
									left: '👉',
									right: '👈',
									top: '👇',
									topLeft: ' ',
									topRight: ' '
								},
								// fullscreen: (width, height) => [width - 2, height - 4],
								padding: 1
							}
						)
				  )
		}),
		child_process.exec(`cd ${name} && ${settings.includes('yarn') ? 'yarn' : 'bun'} run dev`, {stdio: [0, 1, 2]})
	])
else console.log(`✅ 5/5 - no-dev flag passed`)
