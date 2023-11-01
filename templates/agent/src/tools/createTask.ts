import {DynamicStructuredTool} from 'langchain/tools'
import z from 'zod'
import {createTask} from '~/app/actions/createTask'

export const createTaskTool = new DynamicStructuredTool({
	name: 'createTask',
	description: 'Create a task',
	func: async ({title, status}) => {
		const createdTask = await createTask({status, title})

		return JSON.stringify(createdTask)
	},
	schema: z.object({
		status: z.boolean(),
		title: z.string()
	})
})
