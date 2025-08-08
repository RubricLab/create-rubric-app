import type { models } from '~/constants/models'

export type Model = (typeof models)[number]

export type Task = {
	id: number
	title: string
	createdAt: Date
	status: boolean
}
