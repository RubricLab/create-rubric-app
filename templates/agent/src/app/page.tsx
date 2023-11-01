'use client'

import {useEffect, useState} from 'react'
import {listTasks} from '~/app/actions/listTasks'
import ChatBox from '~/components/ChatBox'
import Nav from '~/components/Nav'
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
		<div className='flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-12'>
			<Nav title={'create-rubric-app'} />
			<TaskList tasks={tasks} />
			<ChatBox refetch={fetchTasks} />
		</div>
	)
}
