import ChatBox from '../components/ChatBox'
import TodoList from '../components/TodoList'

export default function Page() {
	return (
		<div className='flex min-h-screen w-full items-center justify-center gap-10'>
			<div className='flex max-w-2xl flex-col gap-10'>
				<h1 className='rounded-md bg-stone-200 px-4 py-2'>create-rubric-app</h1>
				<ChatBox />
				<TodoList />
			</div>
		</div>
	)
}
