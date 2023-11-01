'use client'

import {useEffect, useState} from 'react'
import {listTasks} from '~/app/actions/listTasks'
import ChatBox from '~/components/ChatBox'
import TaskList from '~/components/TaskList'

export default function Page() {
	const [tasks, setTasks] = useState([])

	const fetchTasks = async () => {
		const tasks = await listTasks()

		setTasks(tasks)
	}

	useEffect(() => {
		fetchTasks()
	}, [])

	return (
		<div className='relative flex h-screen w-full flex-col items-center justify-center gap-12 p-5'>
			<TaskList tasks={tasks} />
			<ChatBox refetch={fetchTasks} />
		</div>
	)
}
