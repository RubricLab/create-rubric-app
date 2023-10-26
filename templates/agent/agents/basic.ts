import {initializeAgentExecutorWithOptions} from 'langchain/agents'
import {ChatOpenAI} from 'langchain/chat_models/openai'
import {env} from '../env.mjs'
import createTaskTool from '../tools/createTask'
import deleteTaskTool from '../tools/deleteTask'
import helloTool from '../tools/hello'
import listTasksTool from '../tools/listTasks'
import rankTasksTool from '../tools/rankTask'
import updateTaskTool from '../tools/updateTask'

const gptModel = 'gpt-4'

const model = new ChatOpenAI({
	modelName: gptModel,
	openAIApiKey: env.OPENAI_API_KEY,
	temperature: 0
})

const tools = [
	helloTool({apiKey: '0'}), // The apiKey is not passed to the AI, but is used by the tool
	createTaskTool(),
	deleteTaskTool(),
	listTasksTool(),
	rankTasksTool(),
	updateTaskTool()
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
