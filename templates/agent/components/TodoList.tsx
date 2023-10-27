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
						className='h-5 w-5'
						defaultChecked={task.status}
						type='checkbox'
					/>{' '}
					<div className='flex w-full items-center justify-between'>
						<p>{task.title}</p>
						<span className='text-xs text-stone-400'>
							{new Date(task.createdAt).toLocaleDateString('en-US', {
								day: '2-digit',
								hour: '2-digit',
								minute: '2-digit',
								month: 'short'
							})}
						</span>
					</div>
				</div>
			))}
		</div>
	)
}
