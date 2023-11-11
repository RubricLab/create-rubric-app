import {basicAgent} from '~/agents/basic'

export async function POST(req) {
	const { input, modelName } = await req.json()
	console.log("Using OpenAI", modelName)
	
	const stream = basicAgent({input, modelName})
	
	return new Response(await stream)
}
