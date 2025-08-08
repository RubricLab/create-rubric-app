import { ChevronDown } from 'lucide-react'
import { models } from '~/constants/models'
import type { Model } from '~/utils/types'

type Props = {
	model: Model
	setModel: (model: Model) => void
}

export default function ChooseBot({ model, setModel }: Props) {
	return (
		<div className="relative flex w-full justify-start font-mono">
			<select value={model} onChange={e => setModel(e.currentTarget.value as Model)}>
				{models.map((model, index: number) => {
					return (
						<option key={index} value={model}>
							{model}
						</option>
					)
				})}
			</select>
			<div className="absolute right-0 flex h-full items-center pr-4">
				<ChevronDown />
			</div>
		</div>
	)
}
