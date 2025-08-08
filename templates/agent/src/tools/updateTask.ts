import { createTool } from '@rubriclab/agents'
import z from 'zod/v4'
import { updateTask } from '~/app/actions/updateTask'

export const updateTaskTool = createTool({
	execute: async ({ id, title, status }) => {
		const updatedTask = await updateTask({ id, status, title })

		return JSON.stringify(updatedTask)
	},
	schema: {
		input: z.object({
			id: z.number().describe('Integer ID of the task'),
			status: z.boolean().describe('Status of the task, true if completed, false otherwise'),
			title: z.string().describe('Title of the task')
		}),
		output: z.string().describe('JSON string of the updated task')
	}
})
