import {DynamicStructuredTool} from 'langchain/tools'
import z from 'zod'
import db from '~/utils/db'

// Update a task
export async function updateTask({
	id,
	status,
	title
}: {
	id: number
	status: boolean
	title: string
}) {
	const updatedTask = await db.task.update({
		data: {status: status, title: title},
		where: {id: id}
	})
	return JSON.stringify(updatedTask)
}

export default function updatedTaskTool() {
	return new DynamicStructuredTool({
		description: 'Update a task',
		func: async ({id, title, status}) => {
			return JSON.stringify(await updateTask({id, status, title}))
		},
		name: 'updateTask',
		schema: z.object({
			id: z.number().describe('Integer ID of the task'),
			status: z
				.boolean()
				.describe('Status of the task, true if completed, false otherwise'),
			title: z.string().describe('Title of the task')
		})
	})
}
