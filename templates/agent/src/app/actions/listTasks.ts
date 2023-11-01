'use server'

import db from '~/utils/db'

// Get all tasks
export async function listTasks() {
	const allTasks = await db.task.findMany({
		orderBy: {
			createdAt: 'desc'
		}
	})

	return allTasks
}
