import {PrismaClient} from '@prisma/client'
import {DynamicStructuredTool} from 'langchain/tools'
import z from 'zod'

const prisma = new PrismaClient()

// Update a task
export async function updateTask({id, input}: {id: number; input: string}) {
	const updatedTask = await prisma.task.update({
		data: {title: input},
		where: {id: id}
	})
	return JSON.stringify(updatedTask)
}

export default function updatedTaskTool() {
	return new DynamicStructuredTool({
		description: 'Update a task',
		func: async ({id, input}) => {
			return JSON.stringify(await updateTask({id, input}))
		},
		name: 'updateTask',
		schema: z.object({id: z.number(), input: z.string()})
	})
}
