import {initializeAgentExecutorWithOptions} from 'langchain/agents'
import {ChatOpenAI} from 'langchain/chat_models/openai'
import {env} from '../env.mjs'
import helloTool from '../tools/hello'
import listTodosTool from '../tools/listTodos'
import createTodoTool from '../tools/createTodo'

const gptModel = 'gpt-4'

const model = new ChatOpenAI({
	modelName: gptModel,
	openAIApiKey: env.OPENAI_API_KEY,
	temperature: 0
})

const tools = [
	helloTool({ apiKey: '0' }), // The apiKey is not passed to the AI, but is used by the tool
	listTodosTool(),
	createTodoTool()
]

export default async function basicAgent({input}) {
	console.log('initializing agent executor')
	const executor = await initializeAgentExecutorWithOptions(tools, model, {
		agentArgs: {
			prefix: `You are a generally intelligent AI.`
		},
		agentType: 'openai-functions',
		returnIntermediateSteps: env.NODE_ENV === 'development',
		verbose: env.NODE_ENV === 'development'
	})

	const result = await executor.call({input})
	const {output} = result

	return output
}
