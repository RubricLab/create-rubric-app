import {listTasks} from '../tools/listTasks'

export default async function TodoList() {
	const tasks = await listTasks()
	return (
		<div className='flex w-full flex-col gap-3'>
			{tasks.map(task => (
				<div
					className='flex items-center gap-2'
					key={task.id}>
					<input
						checked={task.complete}
						className='h-5 w-5'
						type='checkbox'
					/>{' '}
					<p>{task.title}</p>
				</div>
			))}
		</div>
	)
}
