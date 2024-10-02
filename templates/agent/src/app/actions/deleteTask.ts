'use server'

import { db } from '~/utils/db'

// Delete a task
export async function deleteTask({ id }: { id: number }) {
	const deletedTask = await db.task.delete({
		where: {
			id
		}
	})

	return deletedTask
}
