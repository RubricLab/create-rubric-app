'use client'

import {useEffect} from 'react'
import {useFormState, useFormStatus} from 'react-dom'
import {toast} from 'sonner'
import sayHello from '~/lib/actions/say-hello'

const initialState = {
	type: null,
	message: null
}

function SubmitButton() {
	const {pending} = useFormStatus()
	return (
		<button
			type='submit'
			className='primary'
			disabled={pending}>
			Submit
		</button>
	)
}

export default function DemoForm() {
	const [state, formAction] = useFormState(sayHello, initialState)

	// Loading state
	useEffect(() => {
		if (state?.type === 'success') toast.success(state?.message)
		else if (state?.type === 'error') {
			toast.error(state?.message)
			console.error(state?.message)
		}
	}, [state])

	return (
		<form
			className='flex w-full gap-4'
			action={formAction}>
			<input
				name='name'
				placeholder='Enter your name'
			/>
			<SubmitButton />
		</form>
	)
}
