'use client'

import {useEffect, useState} from 'react'
import ChatBox from '~/components/ChatBox'
import TaskList from '~/components/TaskList'

export default function Page() {
	const [tasks, setTasks] = useState([])

	const fetchTasks = async () => {
		const res = await fetch('/api/tasks')
		const data = await res.json()

		setTasks(data.tasks)
	}

	useEffect(() => {
		fetchTasks()
	}, [])

	return (
		<div className='flex min-h-screen w-full items-center justify-center gap-10'>
			<div className='flex w-full max-w-xl flex-col items-center gap-10'>
				<h1 className='w-fit rounded-md bg-stone-200 px-4 py-2'>
					create-rubric-app
				</h1>
				<ChatBox refetch={fetchTasks} />
				<TaskList tasks={tasks} />
			</div>
		</div>
	)
}
