export default function getDir() {
	const parts = __dirname.split('/')
	const path = parts.slice(0, parts.indexOf('src') - 2).join('/')

	return path
}
