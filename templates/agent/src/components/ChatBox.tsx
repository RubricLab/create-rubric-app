'use client'

import {CheckIcon} from 'lucide-react'
import {useState} from 'react'
import Loader from './Loader'

type Props = {
	refetch: () => void
}

// List of messages to be rendered in the UI
const messages = new Map([
	['createTask', {message: 'Creating task', className: 'text-green-500'}],
	['deleteTask', {message: 'Deleting task', className: 'text-red-500'}],
	['updateTask', {message: 'Updating task', className: 'text-stone-500'}],
	['listTasks', {message: 'Listing tasks', className: 'text-stone-500'}]
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
		return {message: 'Action not recognized', className: 'text-red-500'}
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
		<>
			{streamedData ? (
				<div className='flex flex-col gap-2'>
					{streamedData.map((line, index) => (
						<p
							className={`text-sm ${getMessage(line).className}`}
							key={index}>
							{getMessage(line).message}
						</p>
					))}
				</div>
			) : null}

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
		</>
	)
}
