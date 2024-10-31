import fs from 'node:fs/promises'

export async function copyDir({ source, destination }: { source: string; destination: string }) {
	await fs.cp(`${__dirname}/../../${source}`, destination, { recursive: true })
}

export async function getPackageJSON({ projectDirectory }: { projectDirectory: string }) {
	return JSON.parse(await Bun.file(`${projectDirectory}/package.json`).text())
}

export async function writePackageJSON({
	projectDirectory,
	json
}: { projectDirectory: string; json: JSON }) {
	await Bun.write(`${projectDirectory}/package.json`, JSON.stringify(json))
}
