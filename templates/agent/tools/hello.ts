import {DynamicStructuredTool} from 'langchain/tools'
import z from 'zod'

async function hello({apiKey, name}) {
	const urlParams = new URLSearchParams({apiKey, name})
	const response = await fetch('/api/hello?' + urlParams.toString())
	const data = await response.json()

	if (response.status !== 200)
		return {
			error: data.message
		}

	return data
}

export default function helloTool({apiKey}) {
	return new DynamicStructuredTool({
		description: 'Say hello using the Hello World API',
		func: async ({name}) => {
			return JSON.stringify(await hello({apiKey, name}))
		},
		name: 'hello',
		schema: z.object({
			name: z.string().optional()
		})
	})
}
