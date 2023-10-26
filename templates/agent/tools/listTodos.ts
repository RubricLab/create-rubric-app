import {DynamicStructuredTool} from 'langchain/tools'
import z from 'zod'

export async function listTodos() {
	return []
}

export default function listTodosTool() {
	return new DynamicStructuredTool({
		description: 'List all todos',
		func: async () => {
			return JSON.stringify(await listTodos())
		},
		name: 'listTodos',
		schema: z.object({})
	})
}
