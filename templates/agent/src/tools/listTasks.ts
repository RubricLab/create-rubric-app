import { createTool } from '@rubriclab/agents'
import z from 'zod/v4'
import { listTasks } from '~/app/actions/listTasks'

export const listTasksTool = createTool({
	execute: async () => {
		const allTasks = await listTasks()

		return JSON.stringify(allTasks)
	},
	schema: {
		input: z.object({}),
		output: z.string().describe('JSON string of the list of tasks')
	}
})
