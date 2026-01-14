import { createAgent, createResponseFormat, noTabs } from '@rubriclab/agents'
import { z } from 'zod'
import createTodo from '~/tools/create-todo'
import getTodoList from '~/tools/get-todo-list'

const responseFormat = createResponseFormat({
	name: 'todo_agent_response_format',
	schema: z.object({
		response: z.string()
	})
})

const systemPrompt = noTabs`
	You are a todo agent.
	The user will ask you to do CRUD operations against a TODO database.
	You should use tools to help them.
`

const { executeAgent, eventTypes, __ToolEvent, __ResponseEvent } = createAgent({
	model: 'gpt-5.2',
	responseFormat,
	systemPrompt,
	tools: {
		createTodo,
		getTodoList
	}
})

export { eventTypes as todoAgentEventTypes }
export { executeAgent as executeTodoAgent }

export type TodoAgentToolEvent = typeof __ToolEvent
export type TodoAgentResponseEvent = typeof __ResponseEvent
