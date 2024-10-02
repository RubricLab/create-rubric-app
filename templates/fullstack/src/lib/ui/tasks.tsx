'use client'

import { useState } from 'react'
import { useTasks } from '~/context/taskContext'

export default function Tasks() {
	const [task, setTask] = useState('')
	const { tasks, createTask, deleteTask, updateTask } = useTasks()

	return (
		<div className="flex flex-col gap-5">
			<h1>Tasks</h1>
			<ul className="flex flex-col gap-5">
				{tasks.map(task => (
					<li key={task.id} className="flex justify-between gap-5">
						<div className="flex items-center gap-5">
							<input
								type="checkbox"
								checked={task.status}
								onChange={() =>
									updateTask({
										id: task.id,
										status: !task.status
									})
								}
							/>
							<input
								type="text"
								value={task.title}
								onChange={e =>
									updateTask({
										id: task.id,
										title: e.target.value
									})
								}
							/>
						</div>
						<button type="button" onClick={() => deleteTask({ id: task.id })}>
							X
						</button>
					</li>
				))}
			</ul>
			<input type="text" value={task} onChange={e => setTask(e.target.value)} />
			<button type="button" onClick={() => createTask({ title: task })}>
				Create Task
			</button>
		</div>
	)
}
