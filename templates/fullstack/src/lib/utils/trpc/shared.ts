import {type inferRouterInputs, type inferRouterOutputs} from '@trpc/server'
import superjson from 'superjson'
import {env} from '~/env.mjs'

import {type AppRouter} from '~/server/api'

export const transformer = superjson

export function getUrl() {
	return env.NEXT_PUBLIC_URL + '/api/trpc'
}

export type RouterInputs = inferRouterInputs<AppRouter>

export type RouterOutputs = inferRouterOutputs<AppRouter>
