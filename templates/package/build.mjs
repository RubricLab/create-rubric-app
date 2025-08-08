import { readdir, rename, rm } from 'node:fs/promises'
import path from 'node:path'
import dts from 'bun-plugin-dts'

const distDir = './dist'

// Clean dist directory before building
await rm(distDir, {
	force: true,
	recursive: true
})

// Run build
await Bun.build({
	entrypoints: ['./src/index.ts'],
	minify: true,
	outdir: './dist',
	plugins: [dts()]
})

// Rename the generated CSS file to index.css
const files = await readdir(distDir)
const cssFile = files.find(file => file.endsWith('.css'))
if (cssFile) {
	const oldPath = path.join(distDir, cssFile)
	const newPath = path.join(distDir, 'index.css')
	await rename(oldPath, newPath)
}
