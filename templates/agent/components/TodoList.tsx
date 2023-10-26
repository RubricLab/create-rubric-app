import {listTasks} from '../tools/listTasks'

export default async function TodoList() {
	const tasks = await listTasks()

	return (
		<h1>
			{tasks.map(task => (
				<h2 key={task.id}>
					<input
						checked={task.complete}
						type='checkbox'
					/>{' '}
					{task.title}
				</h2>
			))}
		</h1>
	)
}
