import { watch } from 'node:fs'
import { createEventsServer } from '@rubriclab/events/server'
import { serve } from 'bun'
import { renderToStaticMarkup } from 'react-dom/server.bun'
import { eventTypes } from '~/events'
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
		'/api/hello': () => new Response('Hello, world!'),
		'/api/ping/:channel': async req => {
			await publish({
				channel: req.params.channel,
				eventType: 'ping',
				payload: 'pong'
			})
			return new Response()
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
