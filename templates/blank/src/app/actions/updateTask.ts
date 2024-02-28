'use server'

import {db} from '~/utils/db'

// Update a task
export async function updateTask({
	id,
	status,
	title
}: {
	id: number
	status?: boolean
	title?: string
}) {
	const updatedTask = await db.task.update({
		data: {
			status,
			title
		},
		where: {
			id
		}
	})

	return updatedTask
}
