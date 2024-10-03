import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import type { NextRequest } from 'next/server'

import { env } from '~/env'
import { appRouter } from '~/server/api'
import { createTRPCContext } from '~/server/trpc'

const handler = (req: NextRequest) =>
	fetchRequestHandler({
		endpoint: '/api/trpc',
		req,
		router: appRouter,
		createContext: () => createTRPCContext({ req }),
		onError:
			env.NODE_ENV === 'development'
				? ({ path, error }) => {
						console.error(`❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`)
					}
				: undefined
	})

export { handler as GET, handler as POST }
