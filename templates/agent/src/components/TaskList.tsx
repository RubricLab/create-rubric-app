import {Task} from '@prisma/client'
import {BracesIcon} from 'lucide-react'
import {Fragment, useState} from 'react'
import {updateTask} from '~/app/actions/updateTask'

type Props = {
	tasks: Task[]
}

const TaskList = ({tasks}: Props) => {
	const [codeView, setCodeView] = useState(false)

	return (
		<div className='border-primary bg-primary flex h-full max-h-96 w-full flex-col rounded-md px-3 sm:max-h-[50vh]'>
			<div className='flex w-full items-center justify-between pb-6 pt-3'>
				<h3>Checklist</h3>
				<button
					className='bg-primary border-primary w-fit'
					onClick={() => setCodeView(prev => !prev)}>
					<BracesIcon className='h-5 w-5' />
				</button>
			</div>

			{codeView ? (
				<>
					<div className='text-secondary mb-2'>JSON Preview</div>
					<code className='mb-3 w-full overflow-auto whitespace-pre'>
						{JSON.stringify(tasks, null, 2)}
					</code>
				</>
			) : (
				<>
					<div className='bg-primary text-secondary sticky top-0 flex w-full items-center border-b-2 border-neutral-200 pb-2 text-center dark:border-neutral-800'>
						<div>Status</div>
						<div className='grow'>Task</div>
						<div>Created at</div>
					</div>
					<div className='grid max-h-full w-full grid-cols-12 items-center gap-3 overflow-y-scroll py-4'>
						{/* Render UI on top of structured data */}
						{tasks?.length > 0 ? null : (
							<p className='text-secondary col-span-12 text-base'>No tasks yet</p>
						)}
						{tasks.map(({id, title, status, createdAt}) => (
							<Fragment key={id}>
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
									className='col-span-1'
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
									className='col-span-9'
								/>
								<div className='text-secondary col-span-2 text-xs'>
									{new Date(createdAt).toLocaleDateString('en-US', {
										day: 'numeric',
										hour: 'numeric',
										minute: 'numeric',
										month: 'short'
									})}
								</div>
							</Fragment>
						))}
					</div>
				</>
			)}
		</div>
	)
}

export default TaskList
