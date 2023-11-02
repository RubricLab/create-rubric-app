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
		<div className='border-primary bg-primary flex h-full max-h-80 w-full flex-col gap-5 overflow-y-scroll rounded-md p-3 px-5 sm:max-h-96'>
			<div className='flex w-full items-center justify-between'>
				<h3>Checklist</h3>
				<button
					className='bg-primary border-primary w-fit'
					onClick={() => setShowData(prev => !prev)}>
					<BracesIcon className='h-5 w-5' />
				</button>
			</div>

			{/* Show structured data as an array */}
			{showData ?
				<>
					<div className='flex w-full text-xs'>
						JSON Preview
					</div>
					<code className='w-full whitespace-pre overflow-auto'>{JSON.stringify(tasks, null, 2)}</code>
				</>
				: null}

			{/* Render UI on top of structured data */}
			{!showData && tasks.length === 0 ? (
				<p className='text-base text-stone-400'>No tasks yet</p>
			) : null}

			{showData ? null : (
				<>
					<div className='flex w-full justify-between text-xs'>
						<div>Status</div>
						<div>Name</div>
						<div>Created at</div>
					</div>
					{tasks.map(({id, title, status, createdAt}) => (
						<div
							key={id}
							className='flex items-center justify-between gap-1'>
							<input
								name='status'
								onChange={e => {
									updateTask({
										id,
										status: e.target.checked
									})
								}}
								className='h-5 w-5'
								key={`checkbox-${id}-${status}`}
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
							<div className='text-xs text-stone-400'>
								{new Date(createdAt).toLocaleDateString('en-US', {
									day: 'numeric',
									hour: 'numeric',
									minute: '2-digit',
									month: 'short'
								})}
							</div>
						</div>
					))}
				</>
			)}
		</div>
	)
}

export default TaskList
