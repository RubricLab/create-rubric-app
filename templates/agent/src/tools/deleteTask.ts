import {DynamicStructuredTool} from 'langchain/tools'
import z from 'zod'
import db from '~/utils/db'

// Create a new task
export async function deleteTask({id}: {id: number}) {
	const deletedTask = await db.task.delete({where: {id: id}})
	return JSON.stringify(deletedTask)
}

export const deleteTaskTool = async ()=> new DynamicStructuredTool({
	name: 'deleteTask',
	description: 'Delete a task',
	func: async ({id}) => {
		return JSON.stringify(await deleteTask({id}))
	},
	schema: z.object({id: z.number()})
})
