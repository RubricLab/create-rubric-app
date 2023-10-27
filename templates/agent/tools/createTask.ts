import {DynamicStructuredTool} from 'langchain/tools'
import z from 'zod'
import prisma from '../utils/prisma'

// Create a new task
export async function createTask({
	title,
	status = false // Task is not completed by default
}: {
	title: string
	status?: boolean
}) {
	const addedTask = await prisma.task.create({
		data: {
			status: status,
			title: title
		}
	})
	console.log(addedTask)
	return JSON.stringify(addedTask)
}

export default function createTaskTool() {
	return new DynamicStructuredTool({
		description: 'Create a task',
		func: async ({title, status}) => {
			return JSON.stringify(await createTask({status, title}))
		},
		name: 'createTask',
		schema: z.object({status: z.boolean(), title: z.string()})
	})
}
