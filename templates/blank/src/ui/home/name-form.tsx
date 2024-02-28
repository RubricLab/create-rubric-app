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
		<div className='flex w-full items-center justify-end gap-4'>
			<button
				type='submit'
				className='w-fit'
				disabled={pending}>
				Greet
			</button>
		</div>
	)
}

export default function NameForm() {
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
			className='flex w-full flex-col gap-4'
			action={formAction}>
			<input
				name='name'
				placeholder='Enter name'
			/>
			<SubmitButton />
		</form>
	)
}
