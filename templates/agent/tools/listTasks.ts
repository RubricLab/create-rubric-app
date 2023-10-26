import {PrismaClient} from '@prisma/client'
import {DynamicStructuredTool} from 'langchain/tools'
import z from 'zod'

const prisma = new PrismaClient()

// Get some or all tasks
export async function listTasks() {
	const allTasks = await prisma.task.findMany({orderBy: {createdAt: 'desc'}})
	console.log(allTasks)
	return allTasks
}

export default function listTasksTool() {
	return new DynamicStructuredTool({
		description:
			'List all or some of the tasks sorted in descending order by created timestamp',
		func: async () => {
			return JSON.stringify(await listTasks())
		},
		name: 'listTasks',
		schema: z.object({})
	})
}
