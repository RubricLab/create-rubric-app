'use server'

import { db } from '~/utils/db'

// Create a new task
export async function createTask({
	title,
	status = false // Task is not completed by default
}: {
	title: string
	status?: boolean
}) {
	const addedTask = await db.task.create({
		data: {
			status,
			title
		}
	})

	return addedTask
}
