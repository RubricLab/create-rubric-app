#! /usr/bin/env node

import { checkbox, input, select } from '@inquirer/prompts'
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

function createDirectoryContents (templatePath, newProjectPath) {
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

function copyTemplate (name, template) {
	const projectName = name
	const templatePath = `${__dirname}/templates/${template}`

	mkdirSync(`${CURR_DIR}/${projectName}`)

	createDirectoryContents(templatePath, projectName)
}

async function downloadFile (url, dest) {
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
	values: {name: _name, yes: _yes, template: _template, verbose: _verbose, key: _key}
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
        verbose: {
            short: 'v',
            type: 'boolean'
		},
		key: {
			short: 'k',
			type: 'string'
		}
	}
})

clear()

console.log(
	boxen(
		chalk.bold(
			`Welcome to \n${chalk(
				figlet.textSync('Create Agent App', {
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

let name = _name || (_yes ? 'jarvis' : await input({ default: 'jarvis', message: 'What do you want to name your project?' }))

if (fs.existsSync(name)) {
	let i = 1
	while (fs.existsSync(`${name}-${i}`)) i++
	name = `${name}-${i}`
}

const template = _template || (_yes ? 'agent' : await select({ choices: CHOICES, default: 'agent', message: 'What project template would you like to generate?' }))

const key = _key || ( await input({ default: 'sk-XXX', message: 'What is your Open AI API key? (\u001b]8;;https://platform.openai.com/account/api-keys\u0007Generate one here\u001b]8;;\u0007)'}))
// Ideally -> store default key in rubric.rc file in ~
// Must handle bad key error (it looks like your key is invalid)
// Must handle no GPT 4 avail in account error (it looks like you don't have access to GPT 4, navigate to this page to fix)

const settings = _yes
	? ['scaffold', 'download', 'vscode', 'install', 'dev']
	: await checkbox({
			choices: [
				{checked: true, name: 'scaffold project files', value: 'scaffold'},
				{checked: true, name: 'download assets', value: 'download'},
				{checked: true, name: 'configure vscode', value: 'vscode'},
				{checked: true, name: 'run install', value: 'install'},
				{checked: true, name: 'run dev', value: 'dev'},
			],
			message: 'Do you want to change any settings?'
	})
	  

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
			child_process.exec(`cd ${name} && ${settings.includes('yarn') ? 'yarn' : 'bun'} run dev`, {stdio: [0, 1, 2]})
		])
	else console.log(`✅ 5/5 - no-dev flag passed`)

