import {ChevronDown} from 'lucide-react'

type Props = {
	bot: string
	setBot: (bot: string) => void
}

const models = ['gpt-3.5-turbo', 'gpt-4-1106-preview', 'gpt-4', 'gpt-4-32k']

export default function ChooseBot({bot, setBot}: Props) {
	return (
		<div className='relative flex w-full justify-start font-mono'>
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
			<div className='absolute right-0 flex h-full items-center pr-4'>
				<ChevronDown />
			</div>
		</div>
	)
}
