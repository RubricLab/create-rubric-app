'use client'

import { Button, Input } from 'rubricui'
import { z } from 'zod'
import { sendMagicLink } from './actions'

async function handleSubmit(formData: FormData) {
	try {
		const { email } = z
			.object({ email: z.string().email() })
			.parse(Object.fromEntries(formData.entries()))
		await sendMagicLink({ email })
	} catch (e) {}
}

export default async function SignInPage() {
	return (
		<form action={handleSubmit}>
			<Input name="email" />
			<Button type="submit">Send Magic Link 🪄</Button>
		</form>
	)
}
