import { z } from 'zod'

export const eventTypes = {
	aiMessage: z.object({
		message: z.string()
	}),
	helloSaid: z.object({
		name: z.string()
	})
}
