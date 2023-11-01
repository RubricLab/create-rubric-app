import {Task} from '@prisma/client'
import {BracesIcon} from 'lucide-react'
import {useState} from 'react'
import {updateTask} from '~/app/actions/updateTask'

type Props = {
	tasks: Task[]
}

const TaskList = ({tasks}: Props) => {
	const [showData, setShowData] = useState(false)

	return (
		<div className='border-primary bg-primary flex h-full max-h-80 w-full flex-col gap-3 overflow-y-scroll rounded-md p-3'>
			<div className='flex w-full items-center justify-between'>
				<h3>Checklist</h3>
				<button
					className='bg-primary border-primary w-fit'
					onClick={() => setShowData(prev => !prev)}>
					<BracesIcon className='h-5 w-5' />
				</button>
			</div>

			{/* Show structured data as an array */}
			{showData ? <code className='w-full'>{JSON.stringify(tasks)}</code> : null}

			{/* Render UI on top of structured data */}
			{!showData && tasks.length === 0 ? (
				<p className='text-base text-stone-400'>No tasks yet</p>
			) : null}

			{showData
				? null
				: tasks.map(({id, title, status, createdAt}) => (
						<div
							key={id}
							className='flex items-center justify-between gap-2'>
							<input
								name='status'
								onChange={e => {
									updateTask({
										id,
										status: e.target.checked
									})
								}}
								className='h-5 w-5'
								key={`checkbox-${id}-${title}`}
								defaultChecked={status}
								type='checkbox'
							/>
							<input
								name='title'
								onChange={e =>
									updateTask({
										id,
										title: e.target.value
									})
								}
								key={`task-${id}-${title}`}
								className='w-3/4 border-none'
								defaultValue={title}
							/>
							<span className='text-xs text-stone-400'>
								{new Date(createdAt).toLocaleDateString('en-US', {
									day: '2-digit',
									hour: '2-digit',
									minute: '2-digit',
									month: 'short'
								})}
							</span>
						</div>
				  ))}
		</div>
	)
}

export default TaskList
