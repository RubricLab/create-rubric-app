import { watch } from 'node:fs'
import { createEventsServer } from '@rubriclab/events/server'
import { serve } from 'bun'
import { renderToStaticMarkup } from 'react-dom/server.bun'
import { eventTypes } from '~/events/index'
import { Icon } from '../app/icon'
import env from '../lib/env'
import index from './index.html'

const BUN_MAXIMUM_IDLE_TIMEOUT = 255

const { publish, GET } = createEventsServer({
	eventTypes,
	redisURL: env.REDIS_URL
})

const watcher = watch('./src/app', { recursive: true }, (event, path) => {
	console.log('Change event: ', event, path)
	// TODO: register routes at first load and on change
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
			publish({
				channel: req.params.channel,
				eventType: 'message',
				payload: {
					content: body.content,
					id: body.id,
					role: body.role
				}
			})
			publish({
				channel: req.params.channel,
				eventType: 'message',
				payload: {
					content: 'Hello, world!',
					id: Date.now().toString(),
					role: 'assistant'
				}
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
	watcher.close()
	process.exit(0)
})
