import { createTool } from '@rubriclab/agents'
import { z } from 'zod'
import db from '~/db'

export default createTool({
	async execute({ status, title }) {
		const { id } = await db.task.create({
			data: {
				status,
				title
			}
		})
		return { id }
	},
	schema: {
		input: z.object({
			status: z.boolean(),
			title: z.string()
		}),
		output: z.object({
			id: z.string()
		})
	}
})
