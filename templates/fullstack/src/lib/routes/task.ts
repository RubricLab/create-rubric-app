import {z} from 'zod'
import {ACCOUNT_REQUIRED_ERROR} from '~/constants/errors'
import {createTRPCRouter, protectedProcedure} from '~/server/trpc'

export default createTRPCRouter({
	create: protectedProcedure
		.input(z.object({title: z.string()}))
		.mutation(async ({ctx, input}) => {
			if (!ctx.session?.user) throw ACCOUNT_REQUIRED_ERROR

			return await ctx.db.task.create({
				data: {
					title: input.title,
					owner: {
						connect: {
							id: ctx.session.user.id
						}
					}
				}
			})
		}),
	getAll: protectedProcedure.query(async ({ctx}) => {
		if (!ctx.session?.user) throw ACCOUNT_REQUIRED_ERROR

		return await ctx.db.task.findMany({
			where: {
				userId: ctx.session.user.id
			}
		})
	}),
	delete: protectedProcedure
		.input(z.object({id: z.number()}))
		.mutation(async ({ctx, input}) => {
			if (!ctx.session?.user) throw ACCOUNT_REQUIRED_ERROR

			return await ctx.db.task.delete({
				where: {
					id: input.id
				}
			})
		}),
	update: protectedProcedure
		.input(
			z.object({
				id: z.number(),
				title: z.string().optional(),
				status: z.boolean().optional()
			})
		)
		.mutation(async ({ctx, input}) => {
			if (!ctx.session?.user) throw ACCOUNT_REQUIRED_ERROR

			return await ctx.db.task.update({
				where: {
					id: input.id
				},
				data: {
					title: input.title,
					status: input.status
				}
			})
		})
})
