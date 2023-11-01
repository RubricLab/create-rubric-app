import {initializeAgentExecutorWithOptions} from 'langchain/agents'
import {ChatOpenAI} from 'langchain/chat_models/openai'
import {env} from '~/env.mjs'
import {createTaskTool} from '~/tools/createTask'
import {deleteTaskTool} from '~/tools/deleteTask'
import {listTasksTool} from '~/tools/listTasks'
import {updateTaskTool} from '~/tools/updateTask'

export default async function basicAgent({input}) {
	const encoder = new TextEncoder()

	const stream = new TransformStream()

	const writer = stream.writable.getWriter()

	const gptModel = 'gpt-3.5-turbo'
	// const gptModel = 'gpt-4' // use GPT-4 for more complex tasks!

	const model = new ChatOpenAI({
		callbacks: [
			{
				async handleLLMNewToken(token) {
					await writer.ready
					// await writer.write(encoder.encode(`${token}`))
				},
				async handleLLMEnd(data) {
					await writer.ready
					// Return the function name if a function is called, otherwise return the text response
					await writer.write(
						(data.generations[0][0] as any)?.message?.additional_kwargs?.function_call
							?.name || data.generations[0][0]?.text
					)
				},
				async handleLLMError(error) {
					await writer.ready
					await writer.write(encoder.encode(`${error}`))
					await writer.close()
				}
			}
		],
		modelName: gptModel,
		openAIApiKey: env.OPENAI_API_KEY,
		streaming: true,
		temperature: 0
	})

	const tools = [createTaskTool, deleteTaskTool, listTasksTool, updateTaskTool]

	console.log('initializing agent executor')

	const executor = await initializeAgentExecutorWithOptions(tools, model, {
		agentArgs: {
			prefix: `You are a generally intelligent AI.`
		},
		agentType: 'openai-functions'
		// returnIntermediateSteps: env.NODE_ENV === 'development',
		// verbose: env.NODE_ENV === 'development'
	})

	executor.call({input}).then(async () => {
		await writer.ready
		await writer.close()
	})

	return stream.readable
}
