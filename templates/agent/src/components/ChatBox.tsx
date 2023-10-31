'use client'

import {CheckIcon} from 'lucide-react'
import {useState} from 'react'
import { set } from 'zod'

export default function ChatBox() {
	const [streamedData, setStreamedData] = useState('')
	const [objects, setObjects] = useState([])
	const [objectIndex, setObjectIndex] = useState(0)
	const [inObject, setInObject] = useState(false)
	
	async function agentChat(formData: FormData) {
		setStreamedData('')
		const input = formData.get('input') as string

		const response = await fetch('/api/agent', {
			body: JSON.stringify({input}),
			headers: {'Content-Type': 'application/json'},
			method: 'POST'
		})
		const reader = response.body.getReader()

		while (true) {
			const {done, value} = await reader.read()

			if (done) break

			const text = new TextDecoder().decode(value)

			if (text === '[') {
				setInObject(true)
				setObjectIndex(prevIndex => prevIndex + 1)
			}
			else if (text === ']') {
				setInObject(false)
				setStreamedData(prevData => prevData + `\n<code>${JSON.parse(objects[objectIndex])[0].generations[0][0]}</code>\n`)
			}
			
			else if (inObject) {
				setObjects(prevObjects => {
					const newObjects = [...prevObjects]
					newObjects[objectIndex] += text
					return newObjects
				})
			}

			else {
				setStreamedData(prevData => prevData + text)
			}
		}
	}

	const handleClearChat = () => {
		setStreamedData('')
	}

	return (
		<>
			{streamedData && (
				<div className='flex flex-col gap-2'>
					{streamedData.split('\n').map((line, index) => (
						<p
							className='text-sm'
							key={index}>
							{line}
						</p>
					))}
				</div>
			)}
		
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
				type='submit'>
				<CheckIcon />
			</button>
			</form>
		
		</>
	)
}
