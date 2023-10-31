import {listTasks} from '~/tools/listTasks'
import TodoListClient from './TodoListClient'

export default async function TodoListServer() {
	const tasks = await listTasks()
	return <TodoListClient tasks={tasks} />
}
