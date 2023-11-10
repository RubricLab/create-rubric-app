import {basicAgent} from '~/agents/basic'

export async function POST(req) {
	const { input, botName } = await req.json()
	console.log("Using OpenAI", botName)
	
	const stream = basicAgent({input, botName})
	
	return new Response(await stream)
}
