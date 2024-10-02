'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { loggerLink, unstable_httpBatchStreamLink } from '@trpc/client'
import { createTRPCReact } from '@trpc/react-query'
import { type ReactNode, useState } from 'react'

import type { AppRouter } from '~/server/api'
import { getUrl, transformer } from './shared'

export const api = createTRPCReact<AppRouter>()

export function TRPCReactProvider({
	children,
	headers
}: {
	children: ReactNode
	headers: Headers
}) {
	const [queryClient] = useState(() => new QueryClient())

	const [trpcClient] = useState(() =>
		api.createClient({
			transformer,
			links: [
				loggerLink({
					enabled: op =>
						process.env.NODE_ENV === 'development' ||
						(op.direction === 'down' && op.result instanceof Error)
				}),
				unstable_httpBatchStreamLink({
					url: getUrl(),
					headers() {
						const heads = new Map(headers)
						heads.set('x-trpc-source', 'react')
						return Object.fromEntries(heads)
					}
				})
			]
		})
	)

	return (
		<QueryClientProvider client={queryClient}>
			<api.Provider client={trpcClient} queryClient={queryClient}>
				{children}
			</api.Provider>
		</QueryClientProvider>
	)
}
