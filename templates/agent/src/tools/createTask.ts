import { createTool } from '@rubriclab/agents'
import z from 'zod/v4'
import { createTask } from '~/app/actions/createTask'

export const createTaskTool = createTool({
	execute: async ({ title, status }) => {
		const createdTask = await createTask({ status, title })

		return JSON.stringify(createdTask)
	},
	schema: {
		input: z.object({
			status: z.boolean().describe('Status of the task, true if completed, false otherwise'),
			title: z.string().describe('Title of the task')
		}),
		output: z.string().describe('JSON string of the created task')
	}
})
