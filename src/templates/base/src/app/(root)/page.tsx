import { Nav } from '@rubriclab/ui'
import { routes } from '~/routes'
import * as Components from '../../lib/components'

export default async () => {
	return (
		<>
			<Nav routes={routes} />
			{Object.values(Components).map(Component => (
				<Component key={Component.name} />
			))}
		</>
	)
}
