import fs from 'node:fs/promises'
import type { Route } from '@rubriclab/ui'
import type { PackageJson as BasePackageJson } from 'type-fest'

export type PackageJson = {
	[Key in keyof BasePackageJson as string extends Key ? never : Key]: BasePackageJson[Key]
}

export async function copyDir({ source, destination }: { source: string; destination: string }) {
	await fs.cp(`${__dirname}/../../${source}`, destination, { recursive: true })
}

export async function getPackageJSON({
	projectDirectory
}: { projectDirectory: string }): Promise<PackageJson> {
	return JSON.parse(await Bun.file(`${projectDirectory}/package.json`).text())
}

export async function writeFile({ path, content }: { path: string; content: string | object }) {
	const stringContent = typeof content === 'string' ? content : JSON.stringify(content)

	await Bun.write(path, stringContent)
}

export async function writePackageJSON({
	projectDirectory,
	json
}: { projectDirectory: string; json: PackageJson }) {
	await writeFile({
		path: `${projectDirectory}/package.json`,
		content: json
	})
}

export async function writeRoutes({
	projectDirectory,
	json
}: { projectDirectory: string; json: Route[] }) {
	await writeFile({
		path: `${projectDirectory}/src/lib/routes.ts`,
		content: `export const routes = ${JSON.stringify(json)}`
	})
}
