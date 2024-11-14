'use client'

import { createEventHooks } from '@rubriclab/events/hooks'
import { useState } from 'react'
import { Button, Stack } from 'rubricui'
import { toast } from 'sonner'
import { agent } from '../../app/actions/agent'
import { eventTypes } from '../events'

export type Role = 'user' | 'assistant' | 'tool'

export type Message = {
	role: Role
	name?: string
	content: string
}

const { useEvents } = createEventHooks({
	eventTypes
})

export default ({ userId }: { userId: string }) => {
	const [message, setMessage] = useState('')
	const [messages, setMessages] = useState<Message[]>([])

	useEvents({
		id: userId,
		on: {
			aiMessage: ({ message }) => {
				setMessages(prev => {
					return [...prev, { role: 'assistant', content: message }]
				})
			},
			helloSaid: ({ name }) => {
				toast(`Calling tool "${name}"`)
			}
		}
	})

	const handleSubmit = async () => {
		setMessages(prev => [...prev, { role: 'user', content: message }])

		const promise = agent({ message, userId })

		setMessage('')

		toast.promise(promise, {
			loading: 'sending...',
			success: 'sent!',
			error: 'error sending message'
		})
	}

	return (
		<Stack direction="horizontal" className="h-full">
			<Stack className="relative w-full max-w-md shrink-0 overflow-y-scroll p-2 text-sm dark:text-white">
				<Stack gap={4} className="grow">
					{messages.map((e, i) => (
						<Stack
							className={`w-fit rounded-2xl px-2.5 py-1.5 ${
								e.role === 'user' ? 'ml-auto bg-blue-500' : 'bg-neutral-700'
							}`}
							key={i}
						>
							{e.content}
						</Stack>
					))}
				</Stack>
				<Stack
					direction="horizontal"
					className="fixed bottom-0 left-0 w-full max-w-[472px] items-center bg-gradient-to-t from-white to-black/0 p-2 dark:from-black"
				>
					<textarea
						onKeyDown={e => {
							if (e.key === 'Enter' && message && !e.shiftKey) {
								e.preventDefault()
								handleSubmit()
							}
						}}
						placeholder="Send message..."
						className="grow rounded-lg border px-2.5 py-1.5 focus:outline-none dark:border-neutral-800 dark:bg-neutral-950"
						onChange={e => setMessage(e.target.value)}
						value={message}
					/>
					<Button
						className="h-8 w-8 rounded-full border-none bg-blue-500 text-white"
						onClick={handleSubmit}
					>
						↑
					</Button>
				</Stack>
			</Stack>
		</Stack>
	)
}
