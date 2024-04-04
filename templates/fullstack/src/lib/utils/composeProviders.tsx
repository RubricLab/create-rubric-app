import type {JSXElementConstructor, PropsWithChildren, ReactNode} from 'react'

const ComposeProviders = ({
	providers,
	children
}: {
	providers: {
		provider: JSXElementConstructor<PropsWithChildren>
		props?: object
	}[]
	children: ReactNode
}) => {
	return (
		<>
			{providers.reduceRight((acc, {provider: Component, props}) => {
				return <Component {...props}>{acc}</Component>
			}, children)}
		</>
	)
}

export default ComposeProviders
