import {db} from '../src/utils/db'

async function main() {
	await db.task.create({
		data: {
			status: false,
			title: 'Create your first task'
		}
	})
}

main()
	.then(async () => {
		await db.$disconnect()
	})
	.catch(async e => {
		console.error(e)

		await db.$disconnect()
		process.exit(1)
	})
