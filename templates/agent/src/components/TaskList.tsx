import type { Task } from '@prisma/client'
import { BracesIcon } from 'lucide-react'
import { Fragment, useState } from 'react'
import { updateTask } from '~/app/actions/updateTask'

type Props = {
	tasks: Task[]
}

const TaskList = ({ tasks }: Props) => {
	const [codeView, setCodeView] = useState(false)

	return (
		<div className="flex h-full max-h-96 w-full flex-col rounded-md border border-subtle bg-primary px-3 sm:max-h-[50vh]">
			<div className="flex w-full items-center justify-between pt-3 pb-6">
				<h3>Checklist</h3>
				<button
					type="button"
					className="w-fit border-primary bg-primary"
					onClick={() => setCodeView(prev => !prev)}
				>
					<BracesIcon className="h-5 w-5" />
				</button>
			</div>

			{codeView ? (
				<>
					<div className="mb-2 text-secondary">JSON Preview</div>
					<code className="mb-3 w-full overflow-auto whitespace-pre">
						{JSON.stringify(tasks, null, 2)}
					</code>
				</>
			) : (
				<>
					<div className="sticky top-0 flex w-full items-center border-subtle border-b-2 bg-primary pb-2 text-center text-secondary">
						<div>Status</div>
						<div className="grow">Task</div>
						<div>Created at</div>
					</div>
					<div className="grid max-h-full w-full grid-cols-12 items-center gap-3 overflow-y-scroll py-4">
						{/* Render UI on top of structured data */}
						{tasks?.length > 0 ? null : (
							<p className="col-span-12 text-base text-secondary">No tasks yet</p>
						)}
						{tasks.map(({ id, title, status, createdAt }) => (
							<Fragment key={id}>
								<input
									type="checkbox"
									key={`checkbox-${id}-${status}`}
									onChange={e => {
										updateTask({
											id,
											status: e.target.checked
										})
									}}
									defaultChecked={status}
									className="col-span-1"
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
									className="col-span-9"
								/>
								<div className="col-span-2 text-secondary text-xs">
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
