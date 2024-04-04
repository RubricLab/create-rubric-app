import fileRouter from '~/routes/file'
import taskRouter from '~/routes/task'
import {createTRPCRouter} from '~/server/trpc'

export const appRouter = createTRPCRouter({
	task: taskRouter,
	file: fileRouter
})

export type AppRouter = typeof appRouter
