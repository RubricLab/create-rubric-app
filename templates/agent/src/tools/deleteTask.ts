import { createTool } from '@rubriclab/agents'
import z from 'zod/v4'
import { deleteTask } from '~/app/actions/deleteTask'

export const deleteTaskTool = createTool({
	execute: async ({ id }) => {
		const deletedTask = await deleteTask({ id })

		return JSON.stringify(deletedTask)
	},
	schema: {
		input: z.object({
			id: z.number()
		}),
		output: z.string().describe('JSON string of the deleted task')
	}
})
