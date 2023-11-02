'use client'

import {AnimatePresence, motion} from 'framer-motion'
import {ArrowRightIcon} from 'lucide-react'
import {useState} from 'react'
import {useChatScroll} from '~/utils/useChatScroll'
import Loader from './Loader'

type Props = {
	refetch: () => void
}

// List of messages to be rendered in the UI
const messages = new Map([
	[
		'createTask',
		{message: 'Creating task', className: 'bg-green-300 dark:bg-green-600'}
	],
	[
		'deleteTask',
		{message: 'Deleting task', className: 'bg-red-300 dark:bg-red-600'}
	],
	[
		'updateTask',
		{message: 'Updating task', className: 'bg-purple-300 dark:bg-purple-600'}
	],
	[
		'listTasks',
		{message: 'Listing tasks', className: 'bg-blue-300 dark:bg-blue-600'}
	]
])

export default function ChatBox({refetch}: Props) {
	const [prompt, setPrompt] = useState('')
	const [loading, setLoading] = useState(false)

	// Used for streaming response from the agent endpoint
	const [agentOutput, setAgentOutput] = useState([])
	const [objects, setObjects] = useState([])
	const [objectIndex, setObjectIndex] = useState(0)
	const [inObject, setInObject] = useState(false)

	// Find corresponding message and className
	const getMessage = (line: string) => {
		const found = messages.get(line)
		if (found) return found
		return {message: line, className: 'bg-secondary'}
	}

	async function agentChat(input: string) {
		setLoading(true)
		setAgentOutput([])

		const response = await fetch('/api/agent', {
			body: JSON.stringify({input}),
			headers: {'Content-Type': 'application/json'},
			method: 'POST'
		})

		const reader = response.body.getReader()

		// Render streamed data as it comes in
		while (true) {
			const {done, value} = await reader.read()

			if (done) {
				await refetch()
				setLoading(false)
				break
			}

			const text = new TextDecoder().decode(value)

			if (text === '[') {
				setInObject(true)
				setObjectIndex(prevIndex => prevIndex + 1)
			} else if (text === ']') {
				setInObject(false)
				setAgentOutput(prevData => [
					...prevData,
					`\n<code>${JSON.parse(objects[objectIndex])[0].generations[0][0]}</code>\n`
				])
			} else if (inObject)
				setObjects(prevObjects => {
					const newObjects = [...prevObjects]
					newObjects[objectIndex] += text
					return newObjects
				})
			else setAgentOutput(prevData => [...prevData, text])
		}
	}

	// To keep updates scrolled to the bottom
	const scrollRef = useChatScroll(agentOutput)

	return (
		<div className='relative flex h-48 w-full flex-col items-end justify-end gap-5'>
			{/* Toast list */}
			<div
				ref={scrollRef}
				className='relative flex max-h-32 w-full overflow-y-scroll'>
				{agentOutput ? (
					<AnimatePresence>
						<div className='flex h-fit w-full flex-col justify-end gap-2'>
							{agentOutput.map((line, index) => (
								<motion.div
									initial={{opacity: 0}}
									animate={{opacity: 1}}
									transition={{duration: 0.5}}
									key={index}
									className='flex items-center gap-2'>
									<span
										className={`h-2.5 w-2.5 rounded-full ${getMessage(line).className}`}
									/>
									<p className='text-sm'>{getMessage(line).message}</p>
								</motion.div>
							))}
						</div>
					</AnimatePresence>
				) : null}
			</div>

			{/* Chatbox */}
			<form
				className='flex w-full items-start gap-3'
				onSubmit={e => {
					e.preventDefault()
					agentChat(prompt)
					setPrompt('')
				}}>
				<input
					value={prompt}
					placeholder='Try "Add a task" or "Update a task"'
					onChange={e => setPrompt(e.target.value)}
					type='text'
				/>
				<button
					type='submit'
					disabled={loading}>
					{loading ? (
						<Loader className='text-secondary h-6 w-6' />
					) : (
						<ArrowRightIcon />
					)}
				</button>
			</form>
		</div>
	)
}
