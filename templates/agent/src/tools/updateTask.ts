import {DynamicStructuredTool} from 'langchain/tools'
import z from 'zod'
import {updateTask} from '~/app/actions/updateTask'

export const updateTaskTool = new DynamicStructuredTool({
	name: 'updateTask',
	description: 'Update a task',
	func: async ({id, title, status}) => {
		const updatedTask = await updateTask({id, status, title})

		return JSON.stringify(updatedTask)
	},
	schema: z.object({
		id: z.number().describe('Integer ID of the task'),
		status: z
			.boolean()
			.describe('Status of the task, true if completed, false otherwise'),
		title: z.string().describe('Title of the task')
	})
})
