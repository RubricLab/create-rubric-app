import { createEventTypes } from '@rubriclab/events'
import { z } from 'zod'

export const eventTypes = createEventTypes({
	assistant_message: z.object({
		id: z.string(),
		message: z.object({
			response: z.string()
		}),
		type: z.literal('assistant_message')
	}),
	createTodo: z.object({
		arguments: z.object({
			status: z.boolean(),
			title: z.string()
		}),
		call_id: z.string(),
		id: z.string(),
		name: z.literal('createTodo'),
		result: z.undefined(),
		type: z.literal('function_call')
	}),
	getTodoList: z.object({
		arguments: z.object({}),
		call_id: z.string(),
		id: z.string(),
		name: z.literal('getTodoList'),
		result: z.array(
			z.object({
				status: z.boolean(),
				title: z.string(),
				user: z
					.object({
						email: z.string()
					})
					.nullable()
			})
		),
		type: z.literal('function_call')
	})
})
