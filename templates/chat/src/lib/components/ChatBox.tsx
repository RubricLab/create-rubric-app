'use client'

import { type KeyboardEvent, useState } from 'react'

export function ChatBox({
	submit,
	placeholder = 'Type a message...'
}: {
	submit: (message: string) => void
	placeholder?: string
}) {
	const [message, setMessage] = useState(placeholder)

	return (
		<div className="fixed right-0 bottom-0 left-0 bg-white p-4 dark:bg-black">
			<div className="flex w-full items-center justify-center gap-2">
				<textarea
					value={message}
					onChange={e => {
						setMessage(e.target.value)
						e.target.style.height = 'auto'
						e.target.style.height = `${e.target.scrollHeight}px`
					}}
					onKeyDown={(e: KeyboardEvent<HTMLTextAreaElement>) => {
						if (e.key === 'Enter' && !e.shiftKey) {
							e.preventDefault()
							if (message.trim()) {
								submit(message)
								setMessage('')
							}
						}
					}}
					rows={1}
					className="input-field max-w-[800px] flex-1 resize-none rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
				/>
				<button
					type="button"
					onClick={() => {
						if (message.trim()) {
							submit(message)
							setMessage(placeholder)
						}
					}}
					className="input-field self-end rounded-lg border bg-black px-4 py-2 text-white dark:bg-white dark:text-black"
				>
					→
				</button>
			</div>
		</div>
	)
}
