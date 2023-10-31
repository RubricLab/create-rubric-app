import {DynamicStructuredTool} from 'langchain/tools'
import z from 'zod'
import db from '~/utils/db'

// Get some or all tasks
export async function listTasks() {
	return await db.task.findMany({orderBy: {createdAt: 'desc'}})
}

export const listTasksTool = async ()=> new DynamicStructuredTool({
	name: 'listTasks',
	description:
		'List all or some of the tasks sorted in descending order by created timestamp',
	func: async () => {
		return JSON.stringify(await listTasks())
	},
	schema: z.object({})
})
