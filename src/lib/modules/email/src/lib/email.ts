import { Resend } from 'resend'
import { env } from '~/env'

export const {
	emails: { send }
} = new Resend(env.RESEND_API_KEY)
