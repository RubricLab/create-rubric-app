'use client'

import {Task} from '@prisma/client'
import {BracesIcon} from 'lucide-react'
import {useState} from 'react'

export default function TodoListClient({tasks}: {tasks: Task[]}) {
	const [showData, setShowData] = useState(false)

	return (
		<div className='flex w-full max-w-2xl flex-col gap-3 rounded-md border p-3'>
			<div className='flex w-full items-center justify-between'>
				<h3>Checklist</h3>
				<button
					className='w-fit'
					onClick={() => setShowData(prev => !prev)}>
					<BracesIcon className='h-5 w-5' />
				</button>
			</div>

			{/* Show structured data as an array */}
			{showData && <code className='w-full'>{JSON.stringify(tasks)}</code>}

			{/* Render UI on top of structured data */}
			{!showData && tasks.length === 0 && (
				<p className='text-base text-stone-400'>No tasks yet</p>
			)}
			{!showData &&
				tasks.map(task => (
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
