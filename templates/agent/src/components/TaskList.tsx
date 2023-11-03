import {Task} from '@prisma/client'
import {BracesIcon} from 'lucide-react'
import {useState} from 'react'
import {updateTask} from '~/app/actions/updateTask'

type Props = {
	tasks: Task[]
}

const TaskList = ({tasks}: Props) => {
	const [codeView, setCodeView] = useState(false)

	return (
		<div className='border-primary bg-primary flex h-full max-h-96 w-full flex-col gap-2 rounded-md px-3 sm:max-h-[50vh]'>
			<div className='flex w-full items-start justify-between py-4'>
				<h3>Checklist</h3>
				<button
					className='bg-primary border-primary w-fit'
					onClick={() => setCodeView(prev => !prev)}>
					<BracesIcon className='h-5 w-5' />
				</button>
			</div>

			{codeView ? (
				<>
					<div className='flex w-full text-xs'>JSON Preview</div>
					<code className='mb-4 w-full overflow-auto whitespace-pre'>
						{JSON.stringify(tasks, null, 2)}
					</code>
				</>
			) : (
				<>
					<div className='flex w-full justify-between border-b-2 border-neutral-200 pb-2 dark:border-neutral-800'>
						<div>Status</div>
						<div>Name</div>
						<div>Created at</div>
					</div>
					<div className='flex max-h-full flex-col gap-3 overflow-y-scroll py-4'>
						{/* Render UI on top of structured data */}
						{tasks?.length > 0 || codeView ? null : (
							<p className='text-secondary text-base'>No tasks yet</p>
						)}

						{codeView ? null : (
							<>
								{tasks.map(({id, title, status, createdAt}) => (
									<div
										key={id}
										className='flex items-center justify-between gap-4'>
										<input
											type='checkbox'
											key={`checkbox-${id}-${status}`}
											onChange={e => {
												updateTask({
													id,
													status: e.target.checked
												})
											}}
											defaultChecked={status}
										/>
										<input
											onChange={e =>
												updateTask({
													id,
													title: e.target.value
												})
											}
											key={`task-${id}-${title}`}
											defaultValue={title}
										/>
										<div className='text-secondary whitespace-nowrap text-xs'>
											{new Date(createdAt).toLocaleDateString('en-US', {
												day: 'numeric',
												hour: 'numeric',
												minute: 'numeric',
												month: 'short'
											})}
										</div>
									</div>
								))}
							</>
						)}
					</div>
				</>
			)}
		</div>
	)
}

export default TaskList
