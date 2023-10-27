import {CheckIcon} from 'lucide-react'
import {revalidatePath} from 'next/cache'
import basicAgent from '../agents/basic'

export default function ChatBox() {
	async function agentAction(formData: FormData) {
		'use server'
		await basicAgent({input: formData.get('input')})
		revalidatePath('/')
	}
	return (
		<form
			action={agentAction}
			className='flex w-full items-start gap-3'>
			<input
				name='input'
				placeholder='Start typing...'
				type='text'
			/>
			<button
				className='w-fit'
				type='submit'>
				<CheckIcon />
			</button>
		</form>
	)
}
