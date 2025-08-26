export function UserMessage({ children }: { children: React.ReactNode }) {
	return (
		<div className="mb-3 flex justify-end">
			<div className="message-user max-w-3xl rounded-lg px-3 py-2">{children}</div>
		</div>
	)
}

export function AssistantMessage({ children }: { children: React.ReactNode }) {
	return (
		<div className="mb-3 flex justify-start">
			<div className="message-assistant max-w-3xl rounded-lg px-3 py-2">{children}</div>
		</div>
	)
}

export function ToolMessage({
	name,
	args,
	result
}: {
	name: string
	args: React.ReactNode
	result?: React.ReactNode
}) {
	return (
		<div className="mb-3 flex justify-start">
			<div className="message-assistant max-w-3xl rounded-lg px-3 py-2">
				<div className="mb-2 font-medium text-neutral-700 text-sm dark:text-neutral-300">
					Tool: {name}
				</div>

				<div className="space-y-2 text-sm">
					<div>
						<div className="mb-1 font-medium text-neutral-500 text-xs uppercase tracking-wide dark:text-neutral-400">
							Input
						</div>
						<div className="surface rounded p-2">{args}</div>
					</div>
					{result && (
						<div>
							<div className="mb-1 font-medium text-neutral-500 text-xs uppercase tracking-wide dark:text-neutral-400">
								Output
							</div>
							<div className="surface rounded p-2">{result}</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
