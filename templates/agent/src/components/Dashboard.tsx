'use client'

import { useCallback, useState } from 'react'
import { listTasks } from '~/app/actions/listTasks'
import type { Task } from '~/utils/types'
import ChatBox from './ChatBox'
import TaskList from './TaskList'

export function Dashboard({ initialTasks }: { initialTasks: Task[] }) {
	const [tasks, setTasks] = useState<Task[]>(initialTasks)

	const refetch = useCallback(async () => {
		const tasks = await listTasks()
		setTasks(tasks)
	}, [])

	return (
		<div>
			<TaskList tasks={tasks} />
			<ChatBox refetch={refetch} />
		</div>
	)
}
