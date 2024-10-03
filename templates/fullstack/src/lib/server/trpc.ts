import { TRPCError, type inferAsyncReturnType, initTRPC } from '@trpc/server'
import type { NextRequest } from 'next/server'
import superjson from 'superjson'
import { ZodError } from 'zod'
import { getServerAuthSession } from '~/server/auth'
import { db } from '~/server/db'
import s3 from '~/server/s3'

interface CreateContextOptions {
	headers: Headers
}

export async function createInnerTRPCContext(opts: CreateContextOptions) {
	const session = await getServerAuthSession()

	return {
		session,
		headers: opts.headers,
		db,
		s3
	}
}

export async function createTRPCContext(opts: { req: NextRequest }) {
	return await createInnerTRPCContext({
		headers: opts.req.headers
	})
}

export type Context = inferAsyncReturnType<typeof createTRPCContext>

const t = initTRPC.context<typeof createTRPCContext>().create({
	transformer: superjson,
	errorFormatter({ shape, error }) {
		return {
			...shape,
			data: {
				...shape.data,
				zodError: error.cause instanceof ZodError ? error.cause.flatten() : null
			}
		}
	}
})

export const createTRPCRouter = t.router

export const publicProcedure = t.procedure

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
	if (!ctx.session || !ctx.session.user) throw new TRPCError({ code: 'UNAUTHORIZED' })

	return next({
		ctx: {
			session: { ...ctx.session, user: ctx.session.user }
		}
	})
})

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed)
