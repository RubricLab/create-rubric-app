import { listTasks } from '~/app/actions/listTasks'
import { Dashboard } from '~/components/Dashboard'

export default async function Page() {
	const tasks = await listTasks()

	return (
		<div className="flex h-screen w-full flex-col items-center justify-center gap-10 p-5 sm:p-20">
			<Dashboard initialTasks={tasks} />
		</div>
	)
}
