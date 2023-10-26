import {PrismaClient, Task} from '@prisma/client'
import {DynamicStructuredTool} from 'langchain/tools'
import z from 'zod'

const prisma = new PrismaClient()

// This tool takes a string input and compared it against all existing todos and returns
// the most similar todo
export async function rankTask({
	input,
	allTasks
}: {
	input: string
	allTasks: Task[]
}) {
	// Make an intelligence call ranking input agains all tasks using a faster, cheaper model

	// Return the most similar task

	return JSON.stringify(input)
}

export default function rankTasksTool() {
	return new DynamicStructuredTool({
		description:
			'Rank a list of tasks against a text input for most similar to least, 1 being most similar, and so on',
		func: async ({input, allTasks}) => {
			return JSON.stringify(await rankTask({allTasks, input}))
		},
		name: 'rankTasks',
		schema: z.object({
			allTasks: z.array(
				z.object({
					createdAt: z.date(),
					id: z.number(),
					title: z.string()
				})
			),
			input: z.string()
		})
	})
}
