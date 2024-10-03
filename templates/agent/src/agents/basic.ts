import { initializeAgentExecutorWithOptions } from 'langchain/agents'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { env } from '~/env'
import { createTaskTool } from '~/tools/createTask'
import { deleteTaskTool } from '~/tools/deleteTask'
import { listTasksTool } from '~/tools/listTasks'
import { updateTaskTool } from '~/tools/updateTask'

export async function basicAgent({ input, modelName }) {
	const encoder = new TextEncoder()
	const stream = new TransformStream()
	const writer = stream.writable.getWriter()

	const model = new ChatOpenAI({
		callbacks: [
			{
				async handleLLMNewToken(token) {
					await writer.ready
					writer.write(token)
				},
				async handleLLMError(error) {
					await writer.ready
					await writer.write(encoder.encode(`${error}`))
					await writer.close()
				}
			}
		],
		modelName: modelName,
		openAIApiKey: env.OPENAI_API_KEY,
		streaming: true,
		temperature: 0
	})

	const tools = [createTaskTool, deleteTaskTool, listTasksTool, updateTaskTool]

	const prefix =
		'You are a smart task management AI. Users will task you with managing their to-do list or answering basic questions.'

	const executor = await initializeAgentExecutorWithOptions(tools, model, {
		agentArgs: { prefix },
		agentType: 'openai-functions',
		returnIntermediateSteps: env.NODE_ENV === 'development',
		verbose: env.NODE_ENV === 'development',
		callbacks: env.NODE_ENV === 'development' && [
			{
				async handleAgentAction(action) {
					await writer.ready
					await writer.write(`${action.log}`)
				}
			}
		]
	})

	executor.call({ input }).then(async () => {
		await writer.ready
		await writer.close()
	})

	return stream.readable
}
