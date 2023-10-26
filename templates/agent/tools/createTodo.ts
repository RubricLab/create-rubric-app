import {DynamicStructuredTool} from 'langchain/tools'
import z from 'zod'

export async function createTodo({text}: {text: string}) {
	return JSON.stringify(text)
}

export default function createTodoTool() {
	return new DynamicStructuredTool({
		description: 'Create a todo',
		func: async ({text}) => {
			return JSON.stringify(await createTodo({text}))
		},
		name: 'listTodos',
		schema: z.object({text: z.string()})
	})
}
