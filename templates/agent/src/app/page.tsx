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
		<div className='grid min-h-screen w-full grid-cols-2 items-center justify-center'>
			<div className='flex h-full w-full flex-col items-center justify-between gap-10 p-10'>
				<h1 className='w-fit rounded-md bg-stone-200 px-4 py-2'>
					create-rubric-app
				</h1>
				<ChatBox refetch={fetchTasks} />
			</div>
			<div className='flex h-full items-center p-10'>
				<TaskList tasks={tasks} />
			</div>
		</div>
	)
}
