#!/usr/bin/env bun

import db from '~/db'

async function seed() {
	await db.task.create({
		data: {
			status: false,
			title: 'Create your first task'
		}
	})
}

seed()
