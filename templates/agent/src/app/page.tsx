import ChatBox from '~/components/ChatBox'
import TodoList from '~/components/TodoListServer'

export default function Page() {
	return (
		<div className='flex min-h-screen w-full items-center justify-center gap-10'>
			<div className='flex w-full max-w-xl flex-col items-center gap-10'>
				<h1 className='w-fit rounded-md bg-stone-200 px-4 py-2'>
					create-rubric-app
				</h1>
				<ChatBox />
				<TodoList />
			</div>
		</div>
	)
}
