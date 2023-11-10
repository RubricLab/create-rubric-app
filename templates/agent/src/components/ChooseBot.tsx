type Props = {
	bot: string
	setBot: (bot: string) => void
}

const models = ['gpt-3.5-turbo', 'gpt-4-1106-preview', 'gpt-4', 'gpt-4-32k']

export default function ChooseBot({bot, setBot}: Props) {
	return (
		<div className='flex w-full justify-start'>
			<select
				value={bot}
				onChange={e => setBot(e.currentTarget.value)}>
				{models.map((model, index: number) => {
					return (
						<option
							key={index}
							value={model}>
							{model}
						</option>
					)
				})}
			</select>
		</div>
	)
}
