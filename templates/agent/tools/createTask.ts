import {DynamicStructuredTool} from 'langchain/tools'
import z from 'zod'
import prisma from '../utils/prisma'

// Create a new task
export async function createTask({text}: {text: string}) {
	const addedTask = await prisma.task.create({
		data: {
			title: text
		}
	})
	console.log(addedTask)
	return JSON.stringify(addedTask)
}

export default function createTaskTool() {
	return new DynamicStructuredTool({
		description: 'Create a todo',
		func: async ({text}) => {
			return JSON.stringify(await createTask({text}))
		},
		name: 'createTask',
		schema: z.object({text: z.string()})
	})
}
