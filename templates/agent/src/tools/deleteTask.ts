import { DynamicStructuredTool } from 'langchain/tools'
import z from 'zod'
import { deleteTask } from '~/app/actions/deleteTask'

export const deleteTaskTool = new DynamicStructuredTool({
	name: 'deleteTask',
	description: 'Delete a task',
	func: async ({ id }) => {
		const deletedTask = await deleteTask({ id })

		return JSON.stringify(deletedTask)
	},
	schema: z.object({
		id: z.number()
	})
})
