import { type ChatModel, createAgent, noTabs } from '@rubriclab/agents'
import { env } from '~/env'
import { createTaskTool, deleteTaskTool, listTasksTool, updateTaskTool } from '~/tools'

const systemPrompt = noTabs`
		You are a smart task management AI.
		Users will task you with managing their to-do list or answering basic questions.
	`

export async function basicAgent({ input, modelName }: { input: string; modelName: ChatModel }) {
	const { readable, writable } = new TransformStream()
	const writer = writable.getWriter()

	const { executeAgent } = createAgent({
		model: modelName,
		systemPrompt,
		tools: {
			createTask: createTaskTool,
			deleteTask: deleteTaskTool,
			listTasks: listTasksTool,
			updateTask: updateTaskTool
		}
	})

	await writer.ready

	await executeAgent({
		messages: [{ content: input, role: 'user' }],
		onEvent: async event => {
			if (event.type === 'assistant_message') {
				writer.write(event.message.answer)
				await writer.close()
			} else if (event.type === 'function_call') {
				writer.write(event.name)
			}
		},
		openAIKey: env.OPENAI_API_KEY
	})

	return readable
}
