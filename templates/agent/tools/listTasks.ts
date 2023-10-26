import {PrismaClient, Task} from '@prisma/client'
import {DynamicStructuredTool} from 'langchain/tools'
import z from 'zod'

const prisma = new PrismaClient()

// Get some or all tasks
export async function listTasks({ids}: {ids: number[] | null}) {
	let allTasks: Task[] = []
	// If no ids, return all tasks, else find tasks where ids match
	if (!ids) allTasks = await prisma.task.findMany({orderBy: {createdAt: 'desc'}})
	else
		allTasks = await prisma.task.findMany({
			orderBy: {createdAt: 'desc'},
			where: {
				id: {
					in: ids
				}
			}
		})

	console.log(allTasks)
	return JSON.stringify(allTasks)
}

export default function listTasksTool() {
	return new DynamicStructuredTool({
		description:
			'List all or some of the tasks sorted in descending order by created timestamp',
		func: async ({ids}) => {
			return JSON.stringify(await listTasks({ids}))
		},
		name: 'listTasks',
		schema: z.object({ids: z.array(z.number()).nullable()})
	})
}
