import {listTasks} from '~/app/actions/listTasks'
import TodoListClient from './TodoListClient'

export default async function TodoListServer() {
	const tasks = await listTasks()

	return <TodoListClient tasks={tasks} />
}
