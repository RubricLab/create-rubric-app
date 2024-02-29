'use server'

import DemoForm from '~/ui/home/demo-form'

export default async function Page() {
	return (
		<div className='flex h-screen w-full flex-col justify-center gap-10 p-5 sm:p-20'>
			<h1>Welcome</h1>
			<p>
				To get started, edit <code>src/app/page.tsx</code> and save to reload.
			</p>
			<DemoForm />
		</div>
	)
}
