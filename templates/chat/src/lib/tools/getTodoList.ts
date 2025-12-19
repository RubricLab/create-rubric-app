import { createTool } from '@rubriclab/agents'
import { z } from 'zod'
import db from '~/db'

export default createTool({
	async execute() {
		return await db.task.findMany({
			include: {
				user: {
					select: {
						email: true
					}
				}
			}
		})
	},
	schema: {
		input: z.object({}),
		output: z.array(
			z.object({
				status: z.boolean(),
				title: z.string(),
				user: z
					.object({
						email: z.string()
					})
					.nullable()
			})
		)
	}
})
