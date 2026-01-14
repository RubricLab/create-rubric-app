import { createEventsServer } from '@rubriclab/events/server'
import { serve } from 'bun'
import { renderToStaticMarkup } from 'react-dom/server.bun'
import { executeTodoAgent } from '~/agents/todo'
import { eventTypes } from '~/events/index'
import { Icon } from '../app/icon'
import env from '../lib/env'
import index from './index.html'

const BUN_MAXIMUM_IDLE_TIMEOUT = 255

const { publish, GET } = createEventsServer({
	eventTypes,
	redisURL: env.REDIS_URL
})

const server = serve({
	development: env.NODE_ENV !== 'production' && {
		console: true,
		hmr: true
	},
	idleTimeout: BUN_MAXIMUM_IDLE_TIMEOUT,
	routes: {
		'/*': index,
		'/api/events': GET,
		'/api/message/:channel': async req => {
			const body = await req.json()

			await executeTodoAgent({
				messages: [{ content: body.content, role: body.role }],
				onEvent: async events => {
					switch (events.type) {
						case 'assistant_message': {
							await publish({
								channel: req.params.channel,
								eventType: events.type,
								payload: events
							})
							break
						}
						case 'function_call': {
							await publish({
								channel: req.params.channel,
								eventType: events.name,
								payload: events
							})
							break
						}
					}
				},
				openAIKey: env.OPENAI_API_KEY
			})

			return new Response('ok')
		},
		'/favicon.ico': new Response(renderToStaticMarkup(<Icon />), {
			headers: { 'Content-Type': 'image/svg+xml' }
		})
	}
})

console.log(`Server running at ${server.url}`)

process.on('SIGINT', () => {
	console.log('Shutting down...')
	process.exit(0)
})
