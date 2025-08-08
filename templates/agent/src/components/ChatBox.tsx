'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRightIcon } from 'lucide-react'
import { useState } from 'react'
import type { Model } from '~/utils/types'
import { useChatScroll } from '~/utils/useChatScroll'
import ChooseBot from './ChooseBot'
import Loader from './Loader'

// List of messages to be rendered in the UI
const messages = new Map([
	['createTask', { className: 'bg-green-300 dark:bg-green-600', message: 'Creating task' }],
	['deleteTask', { className: 'bg-red-300 dark:bg-red-600', message: 'Deleting task' }],
	['updateTask', { className: 'bg-purple-300 dark:bg-purple-600', message: 'Updating task' }],
	['listTasks', { className: 'bg-blue-300 dark:bg-blue-600', message: 'Listing tasks' }]
])

export default function ChatBox({ refetch }: { refetch: () => void }) {
	const [prompt, setPrompt] = useState('')
	const [loading, setLoading] = useState(false)
	const [model, setModel] = useState<Model>('gpt-4.1')

	// Used for streaming response from the agent endpoint
	const [agentOutput, setAgentOutput] = useState<{ className: string; message: string }[]>([])

	// Find corresponding message and className
	const getMessage = (line: string): [boolean, { message: string; className: string }] => {
		// Check if the line made any action calls
		const messageKeys = Array.from(messages.keys())
		const messageKey = messageKeys.find(key => line.includes(key))
		const found = messages.get(messageKey ?? '')
		if (found) {
			found.message = line.replace(messageKey ?? '', '')
			return [true, found]
		}
		return [false, { className: 'bg-secondary', message: line }]
	}

	async function agentChat(input: string) {
		setLoading(true)
		setAgentOutput([])

		// TODO: migrate this to @rubriclab/events
		const response = await fetch('/api/agent', {
			body: JSON.stringify({ input, modelName: model }),
			headers: {
				'Content-Type': 'application/json'
			},
			method: 'POST'
		})

		const reader = response.body?.getReader()
		if (!reader) {
			console.error('No reader')
			return
		}

		// Set/Reset the index of the messages object
		let objectIndex = 0

		// Render streamed data as it comes in
		while (true) {
			const { done, value } = await reader.read()

			if (done) {
				refetch()
				setLoading(false)
				break
			}

			const text = new TextDecoder().decode(value)

			// Check if a tool call is made and get the according message object
			const [found, messsage] = getMessage(text)

			if (found) {
				setAgentOutput(prevData => [...prevData, messsage])

				// Message is rendered, increment index
				objectIndex++
			}

			// Message is not completed, append to previous message
			else
				setAgentOutput(prevData => {
					const newData = [...prevData]
					newData[objectIndex] = {
						className: messsage.className,
						message: (prevData[objectIndex]?.message ?? '') + text
					}
					return newData
				})
		}
	}

	// To keep updates scrolled to the bottom
	const scrollRef = useChatScroll(agentOutput)

	return (
		<div className="relative flex h-48 w-full flex-col items-end justify-end gap-5">
			{/* Toast list */}
			<div ref={scrollRef} className="relative flex max-h-32 w-full overflow-y-scroll">
				{agentOutput ? (
					<AnimatePresence>
						<div className="flex h-fit w-full flex-col justify-end gap-2">
							{agentOutput.map((line, index) => (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ duration: 0.5 }}
									key={index}
									className="flex items-center gap-2"
								>
									<span className={`h-2.5 w-2.5 rounded-full ${line.className}`} />
									<p className="text-sm">{line.message}</p>
								</motion.div>
							))}
						</div>
					</AnimatePresence>
				) : null}
			</div>

			{/* Chatbox */}
			<form
				className="flex w-full items-start gap-3"
				onSubmit={e => {
					e.preventDefault()
					agentChat(prompt)
					setPrompt('')
				}}
			>
				<input
					value={prompt}
					placeholder='Try "Add a task" or "Update a task"'
					onChange={e => setPrompt(e.target.value)}
					type="text"
				/>
				<button type="submit" disabled={loading}>
					{loading ? <Loader className="h-6 w-6 text-secondary" /> : <ArrowRightIcon />}
				</button>
			</form>
			<ChooseBot {...{ model, setModel }} />
		</div>
	)
}
