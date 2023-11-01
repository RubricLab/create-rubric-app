import {listTasks} from '~/tools/listTasks'

export async function GET() {
	const tasks = await listTasks()
	return new Response(JSON.stringify({tasks}))
}
