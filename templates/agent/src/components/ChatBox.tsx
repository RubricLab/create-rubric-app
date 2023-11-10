'use client'

import {AnimatePresence, motion} from 'framer-motion'
import {ArrowRightIcon} from 'lucide-react'
import {useState} from 'react'
import {useChatScroll} from '~/utils/useChatScroll'
import Loader from './Loader'
import ChooseBot from './ChooseBot';

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
	const [bot, setBot] = useState<string>('gpt-3.5-turbo')

	// Used for streaming response from the agent endpoint
	const [agentOutput, setAgentOutput] = useState([])

	// Find corresponding message and className
	const getMessage = (
		line: string
	): [boolean, {message: string; className: string}] => {
		// Check if the line made any action calls
		const found = messages.get(
			Array.from(messages.keys()).find(key => line.includes(key))
		)
		if (found) {
			found.message = line
			return [true, found]
		} else return [false, {message: line, className: 'bg-secondary'}]
	}

	async function agentChat(input: string) {
		setLoading(true)
		setAgentOutput([])

		const response = await fetch('/api/agent', {
			body: JSON.stringify({input, botName: bot}),
			headers: {'Content-Type': 'application/json'},
			method: 'POST'
		})

		const reader = response.body.getReader()

		// Set/Reset the index of the messages object
		let objInd = 0

		// Render streamed data as it comes in
		while (true) {
			const {done, value} = await reader.read()

			if (done) {
				await refetch()
				setLoading(false)
				break
			}

			const text = new TextDecoder().decode(value)

			// Check if an action call is made and get the according message object
			let [found, messsage] = getMessage(text)

			if (found) {
				setAgentOutput(prevData => [...prevData, messsage])

				// Message is rendered, increment index
				objInd++
			}
			// Message is not completed, append to previous message
			else
				setAgentOutput(prevData => {
					const newData = [...prevData]
					newData[objInd] = {
						message: (prevData[objInd]?.message ?? '') + text,
						className: messsage.className
					}
					return newData
				})
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
									<span className={`h-2.5 w-2.5 rounded-full ${line.className}`} />
									<p className='text-sm'>{line.message}</p>
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
			<ChooseBot bot={bot} setBot={setBot} />
		</div>
	)
}
