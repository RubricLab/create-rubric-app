'use client'

import { useState } from 'react'
import type { TodoAgentResponseEvent, TodoAgentToolEvent } from '~/agents/todo'
import { useSession } from '~/auth/client'
import { ChatBox } from '~/components/ChatBox'
import { AssistantMessage, ToolMessage, UserMessage } from '~/components/Message'

import { useEvents } from '~/events/client'
import { sendMessage } from './ai'

type Message =
	| TodoAgentToolEvent
	| TodoAgentResponseEvent
	| {
			id: string
			type: 'user_message'
			message: string
	  }

function MessageSwitch({ message }: { message: Message }) {
	switch (message.type) {
		case 'user_message': {
			return <UserMessage>{message.message}</UserMessage>
		}

		case 'assistant_message': {
			return <AssistantMessage>{message.message.response}</AssistantMessage>
		}
		case 'function_call': {
			return (
				<ToolMessage
					name={message.name}
					args={JSON.stringify(message.arguments)}
					result={JSON.stringify(message.result)}
				/>
			)
		}
	}
}

function ChatMessages({
	userId,
	messages,
	addMessage
}: {
	userId: string
	messages: Message[]
	addMessage: (message: Message) => void
}) {
	useEvents({
		id: userId,
		on: {
			assistant_message: addMessage
		}
	})

	return (
		<div className="pb-16">
			{messages.map(message => (
				<MessageSwitch key={message.id} message={message} />
			))}
		</div>
	)
}

export default function Chat() {
	const { userId } = useSession()
	const [messages, setMessages] = useState<Message[]>([])

	function addMessage(message: Message) {
		setMessages(prev => [...prev, message])
	}

	function handleSubmit(message: string) {
		addMessage({
			id: Date.now().toString(),
			message,
			type: 'user_message'
		})
		sendMessage({ message, userId })
	}

	return (
		<div className="w-full">
			<ChatMessages userId={userId} messages={messages} addMessage={addMessage} />
			<ChatBox placeholder="What is my todo list?" submit={handleSubmit} />
		</div>
	)
}
