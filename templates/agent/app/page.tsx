import {revalidatePath} from 'next/cache'
import basicAgent from '../agents/basic'
import TodoList from '../components/TodoList'

export default function Page() {
	async function agentAction(formData: FormData) {
		'use server'
		await basicAgent({input: formData.get('input')})
		revalidatePath('/')
	}

	return (
		<div>
		<form action={agentAction}>
			<input
				name='input'
				placeholder='Enter some text'
				type='text'
			/>
			<button type='submit'>Submit</button>
			</form>
			<TodoList/>
		</div>
	)
}
