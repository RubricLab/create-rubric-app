import { basicAgent } from '~/agents/basic'

export async function POST(req: Request) {
	const { input, modelName } = await req.json()

	const stream = await basicAgent({ input, modelName })

	return new Response(stream)
}
