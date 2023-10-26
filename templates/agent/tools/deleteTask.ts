import {PrismaClient} from '@prisma/client'
import {DynamicStructuredTool} from 'langchain/tools'
import z from 'zod'

const prisma = new PrismaClient()

// Create a new task
export async function deleteTask({id}: {id: number}) {
	const deletedTask = await prisma.task.delete({where: {id: id}})
	return JSON.stringify(deletedTask)
}

export default function deleteTaskTool() {
	return new DynamicStructuredTool({
		description: 'Delete a task',
		func: async ({id}) => {
			return JSON.stringify(await deleteTask({id}))
		},
		name: 'deleteTask',
		schema: z.object({id: z.number()})
	})
}
