import NameForm from '~/ui/home/name-form'

export default function Page() {
	return (
		<div className='flex h-screen w-full flex-col justify-center gap-10 p-5 sm:p-20'>
			<h1>Welcome</h1>
			<p>
				To get started, edit <code>src/page.tsx</code> and save to reload.
			</p>
			<NameForm />
		</div>
	)
}
