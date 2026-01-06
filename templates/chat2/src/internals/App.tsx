import { useEvents } from '~/events/client'
import '../globals.css'
import { Button, cn, Input } from '@rubriclab/ui'
import { useState } from 'react'
import type { z } from 'zod'
import type { eventTypes } from '~/events'

const channelId = Date.now().toString()

export function App() {
	const [messages, setMessages] = useState<z.infer<(typeof eventTypes)['message']>[]>([])
	const [message, setMessage] = useState('')

	useEvents({
		id: channelId,
		on: {
			message: payload => setMessages(prev => [...prev, payload])
		}
	})

	return (
		<div className="flex h-screen flex-col items-center justify-center gap-4 p-8">
			<div className="flex w-full max-w-xl grow flex-col gap-4">
				{messages.map(message => (
					<p
						key={message.id}
						className={cn(
							message.role === 'user' ? 'ml-auto bg-primary' : 'bg-muted',
							'w-fit rounded-default p-2 px-3'
						)}
					>
						{message.content}
					</p>
				))}
			</div>
			<div className="flex items-center gap-4">
				<Input value={message} onChange={e => setMessage(e.target.value)} />
				<Button
					onClick={async () => {
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
