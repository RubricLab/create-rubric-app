import { createTool } from '@rubriclab/agents'
import { z } from 'zod'
import db from '~/db'

export default createTool({
	async execute({ status, title }) {
		await db.task.create({
			data: {
				status,
				title
			}
		})
		return undefined
	},
	schema: {
		input: z.object({
			status: z.boolean(),
			title: z.string()
		}),
		output: z.undefined()
	}
})
