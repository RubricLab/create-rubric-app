'use server'

import {z} from 'zod'

const schema = z.object({
	name: z.string()
})

export default async function sayHello(prevState: any, formData: FormData) {
	const parsed = schema.parse({
		name: formData.get('name')
	})

	if (!parsed.name)
		return {
			message: 'Missing name',
			type: 'error'
		}

	try {
		if (parsed.name)
			return {
				message: `Hello ${parsed.name}, from the server 👋`,
				type: 'success'
			}
	} catch (err) {
		if (err instanceof Error)
			return {
				message: err.message,
				type: 'error'
			}
		return {
			message: `Unexpected error: ${JSON.stringify(err)}`,
			type: 'error'
		}
	}
}
