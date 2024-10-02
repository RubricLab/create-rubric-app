'use client'

import type { Task } from '@prisma/client'
import { createContext, type ReactNode, useContext, useState } from 'react'
import { api } from '~/utils/trpc/react'
import type { RouterInputs, RouterOutputs } from '~/utils/trpc/shared'

interface TaskContextType {
	tasks: RouterOutputs['task']['getAll']
	createTask: (task: RouterInputs['task']['create']) => void
	deleteTask: (task: RouterInputs['task']['delete']) => void
	updateTask: (task: RouterInputs['task']['update']) => void
}

export const TaskContext = createContext<TaskContextType>(undefined)

export function TaskProvider({
	children,
	tasks: ssrTasks
}: {
	children: ReactNode
	tasks: Task[]
}) {
	const [tasks, setTasks] = useState<Task[]>(ssrTasks)

	const createTaskMutation = api.task.create.useMutation()

	const deleteTaskMutation = api.task.delete.useMutation()

	const updateTaskMutation = api.task.update.useMutation()

	const util = api.useUtils()

	api.task.getAll.useQuery(undefined, {
		enabled: true,
		onSuccess: data => {
			setTasks(data)
		}
	})

	async function createTask(task: RouterInputs['task']['create']) {
		// optimistic update
		if (task)
			setTasks(prevTasks => {
				const updatedTasks = [
					...prevTasks,
					{
						title: task.title,
						status: false,
						id: 0,
						userId: '',
						createdAt: new Date()
					}
				]
				return updatedTasks
			})
		await createTaskMutation.mutateAsync(task)
		await util.task.getAll.invalidate()
	}

	async function deleteTask(task: RouterInputs['task']['delete']) {
		// optimistic update
		if (task)
			setTasks(prevTasks => {
				const updatedTasks = prevTasks.filter(t => t.id !== task.id)
				return updatedTasks
			})
		await deleteTaskMutation.mutateAsync(task)
		await util.task.getAll.invalidate()
	}

	async function updateTask(task: RouterInputs['task']['update']) {
		// optimistic update
		if (task)
			setTasks(prevTasks => {
				const updatedTasks = prevTasks.map(t => {
					if (t.id === task.id) {
						return { ...t, ...task }
					}
					return t
				})
				return updatedTasks
			})
		await updateTaskMutation.mutateAsync(task)
		await util.task.getAll.invalidate()
	}

	const value: TaskContextType = {
		tasks,
		createTask,
		deleteTask,
		updateTask
	}

	return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}

export function useTasks() {
	return useContext(TaskContext)
}
