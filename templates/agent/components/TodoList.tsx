import {listTasks} from '../tools/listTasks'

export default async function TodoList() {
	const tasks = await listTasks()
	return (
		<div className='flex w-full flex-col gap-3 rounded-md border p-3'>
			<h3>Checklist</h3>
			{tasks.length === 0 && (
				<p className='text-base text-stone-400'>No tasks yet</p>
			)}
			{tasks.map(task => (
				<div
					className='flex items-center gap-2'
					key={task.id}>
					<input
						checked={task.status}
						className='h-5 w-5'
						type='checkbox'
					/>{' '}
					<p>{task.title}</p>
				</div>
			))}
		</div>
	)
}
