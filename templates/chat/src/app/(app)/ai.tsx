'use server'

import { executeTodoAgent } from '~/agents/todo'
import env from '~/env'
import { publish } from '~/events/server'

export async function sendMessage({ userId, message }: { userId: string; message: string }) {
	const { response } = await executeTodoAgent({
		messages: [{ content: message, role: 'user' }],
		onEvent: async events => {
			switch (events.type) {
				case 'assistant_message': {
					await publish({
						channel: userId,
						eventType: events.type,
						payload: events
					})
					break
				}
				case 'function_call': {
					await publish({
						channel: userId,
						eventType: events.name,
						payload: events
					})
					break
				}
			}
		},
		openAIKey: env.OPENAI_API_KEY
	})

	console.log(response)
}
