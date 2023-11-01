'use client'

import {AnimatePresence, motion} from 'framer-motion'
import {CheckIcon} from 'lucide-react'
import {useState} from 'react'
import Loader from './Loader'

type Props = {
	refetch: () => void
}

// List of messages to be rendered in the UI
const messages = new Map([
	['createTask', {message: 'Creating task', className: 'bg-green-400'}],
	['deleteTask', {message: 'Deleting task', className: 'bg-red-400'}],
	['updateTask', {message: 'Updating task', className: 'bg-stone-300'}],
	['listTasks', {message: 'Listing tasks', className: 'bg-stone-300'}]
])

export default function ChatBox({refetch}: Props) {
	const [streamedData, setStreamedData] = useState([])
	const [objects, setObjects] = useState([])
	const [objectIndex, setObjectIndex] = useState(0)
	const [inObject, setInObject] = useState(false)
	const [loading, setLoading] = useState(false)

	// Find corresponding message and className
	const getMessage = (line: string) => {
		const found = messages.get(line)
		if (found) return found
		return {message: line, className: 'bg-stone-300'}
	}

	async function agentChat(formData: FormData) {
		setLoading(true)
		setStreamedData([])

		const input = formData.get('input') as string

		const response = await fetch('/api/agent', {
			body: JSON.stringify({input}),
			headers: {'Content-Type': 'application/json'},
			method: 'POST'
		})

		const reader = response.body.getReader()

		while (true) {
			const {done, value} = await reader.read()
			if (done) {
				refetch()
				setLoading(false)
				break
			}
			const text = new TextDecoder().decode(value)

			if (text === '[') {
				setInObject(true)
				setObjectIndex(prevIndex => prevIndex + 1)
			} else if (text === ']') {
				setInObject(false)
				setStreamedData(prevData => [
					...prevData,
					`\n<code>${JSON.parse(objects[objectIndex])[0].generations[0][0]}</code>\n`
				])
			} else if (inObject)
				setObjects(prevObjects => {
					const newObjects = [...prevObjects]
					newObjects[objectIndex] += text
					return newObjects
				})
			else setStreamedData(prevData => [...prevData, text])
		}
	}

	return (
		<div className='flex w-full flex-col items-end justify-end gap-5'>
			{/* Toast list */}
			{streamedData ? (
				<div className='flex h-32 w-full overflow-y-scroll'>
					<AnimatePresence>
						<div className='flex h-full w-full flex-col justify-end gap-2'>
							{streamedData.map((line, index) => (
								<motion.div
									initial={{opacity: 0, y: 10}}
									animate={{opacity: 1, y: 0}}
									transition={{duration: 0.5}}
									key={index}
									className='flex items-center gap-2'>
									<span
										className={`flex h-2 w-2 rounded-full ${getMessage(line).className}`}
									/>
									<p className='text-sm'>{getMessage(line).message}</p>
								</motion.div>
							))}
						</div>
					</AnimatePresence>
				</div>
			) : null}

			{/* Chatbox */}
			<form
				className='flex w-full items-start gap-3'
				onSubmit={e => {
					e.preventDefault()
					agentChat(new FormData(e.currentTarget))
				}}>
				<input
					name='input'
					placeholder='Start typing...'
					type='text'
				/>
				<button
					className='w-fit'
					type='submit'
					disabled={loading}>
					{loading ? <Loader /> : <CheckIcon />}
				</button>
			</form>
		</div>
	)
}
