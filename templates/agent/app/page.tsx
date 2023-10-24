import {revalidatePath} from 'next/cache'
import basicAgent from '../agents/basic'

export default function Page() {
	async function agentAction(formData: FormData) {
		'use server'
		await basicAgent({input: formData.get('input')})
		revalidatePath('/')
	}

	return (
		<form action={agentAction}>
			<input
				name='input'
				type='text'
				placeholder='Enter some text'
			/>
			<button type='submit'>Submit</button>
		</form>
	)
}
