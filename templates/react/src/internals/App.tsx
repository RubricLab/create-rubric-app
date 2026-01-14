import { useEvents } from '~/events/client'
import '../globals.css'
import { Button, cn, Input } from '@rubriclab/ui'
import { useState } from 'react'
import type { TodoAgentResponseEvent, TodoAgentToolEvent } from '~/agents/todo'

const channelId = Date.now().toString()

type Message =
	| TodoAgentToolEvent
	| TodoAgentResponseEvent
	| {
			id: string
			type: 'user_message'
			message: string
	  }

export function App() {
	const [messages, setMessages] = useState<Message[]>([])
	const [message, setMessage] = useState('')

	useEvents({
		id: channelId,
		on: {
			assistant_message: payload => setMessages(prev => [...prev, payload]),
			createTodo: payload => setMessages(prev => [...prev, payload]),
			getTodoList: payload => setMessages(prev => [...prev, payload])
		}
	})

	return (
		<div className="flex h-screen flex-col items-center justify-center gap-4 p-8">
			<div className="flex w-full max-w-xl grow flex-col gap-4">
				{messages.map(message => (
					<p
						key={message.id}
						className={cn(
							message.type === 'user_message' ? 'ml-auto bg-primary' : 'bg-muted',
							'w-fit rounded-default p-2 px-3'
						)}
					>
						{message.type === 'user_message'
							? message.message
							: message.type === 'assistant_message'
								? message.message.response
								: message.name}
					</p>
				))}
			</div>
			<div className="flex items-center gap-4">
				<Input value={message} onChange={e => setMessage(e.target.value)} />
				<Button
					onClick={async () => {
						setMessages(prev => [
							...prev,
							{
								id: Date.now().toString(),
								message,
								type: 'user_message'
							}
						])
						await fetch(`/api/message/${channelId}`, {
							body: JSON.stringify({
								content: message,
								id: Date.now().toString(),
								role: 'user'
							}),
							method: 'POST'
						})
						setMessage('')
					}}
					label="Send"
				/>
			</div>
		</div>
	)
}

export default App
