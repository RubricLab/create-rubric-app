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
		<div className='flex min-h-screen w-full max-w-sm flex-col items-center justify-center gap-10'>
			<h1 className='rounded-md bg-stone-200 px-4 py-2'>create-rubric-app</h1>
			<form
				action={agentAction}
				className='flex w-full flex-col items-start gap-5'>
				<input
					name='input'
					placeholder='Enter some text'
					type='text'
				/>
				<button type='submit'>Submit</button>
			</form>
			<TodoList />
		</div>
	)
}
