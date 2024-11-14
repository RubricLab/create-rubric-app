'use server'

import { Agent, createTool } from '@rubriclab/agents'
import { createEventActions } from '@rubriclab/events'
import { z } from 'zod'
import { env } from '~/env'
import { eventTypes } from '../../lib/events'

const { publish } = createEventActions({
	eventTypes,
	redisURL: env.REDIS_URL
})

const sayHello = createTool({
	name: 'sayHello',
	description: 'Says hello to the user',
	schema: z.object({ name: z.string() }),
	function: async ({ name }) => ({ data: { message: `Hello, ${name}!` } })
})

export async function agent({ userId, message }: { userId: string; message: string }) {
	const agent = new Agent({
		systemPrompt: 'you are a curious agent. say hello!',
		messages: [{ role: 'user', content: message }],
		tools: {
			sayHello
		},
		on: {
			assistant: async ({ message }) => {
				await publish({
					channel: userId,
					eventType: 'aiMessage',
					payload: {
						message
					}
				})
			},
			toolCall: async ({ name, args }) => {
				switch (name) {
					case 'sayHello': {
						await publish({
							channel: userId,
							eventType: 'helloSaid',
							payload: args
						})
						break
					}
					default: {
						throw new Error(`Unknown tool: ${name}`)
					}
				}
			}
		}
	})

	return agent.run()
}
