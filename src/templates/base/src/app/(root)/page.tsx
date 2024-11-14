import { Nav } from '@rubriclab/ui'
import { routes } from '~/routes'
import * as Components from '../../components'

export default async () => {
	return (
		<>
			<div className="flex w-full justify-between px-8 py-4">
				<a href="/">X</a>
			</div>
			<Nav routes={routes} />
			{Object.values(Components).map(Component => (
				<Component key={Component.name} />
			))}
		</>
	)
}
