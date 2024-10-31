const reset = '\x1b[0m'
const blue = '\x1b[34m'
const yellow = '\x1b[33m'
const red = '\x1b[31m'
const green = '\x1b[32m'

export const log = {
	info(message: string) {
		console.log(`${blue}[INFO]${reset}`, message)
	},
	warn(message: string) {
		console.log(`${yellow}[WARN]${reset}`, message)
	},
	error(message: string) {
		console.log(`${red}[ERROR]${reset}`, message)
	},
	success(message: string) {
		console.log(`${green}[SUCCESS]${reset}`, message)
	}
}
