import { createAgent, createResponseFormat, noTabs } from '@rubriclab/agents'
import { z } from 'zod/v4'
import createTodo from '~/tools/createTodo'
import getTodoList from '~/tools/getTodoList'

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
	model: 'gpt-4.1-mini',
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
