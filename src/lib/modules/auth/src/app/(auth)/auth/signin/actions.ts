'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { db } from '~/db'
import { resend } from '~/email'
import { env } from '~/env'
import { MagicLinkEmailTemplate } from './templates'

export async function sendMagicLink({
	redirectUrl,
	email
}: { redirectUrl?: string; email: string }) {
	const { key } = await db.session.create({
		data: {
			user: {
				connectOrCreate: {
					where: {
						email
					},
					create: {
						email
					}
				}
			}
		}
	})

	const magicLink = `${env.URL}/auth/signin/magiclink?key=${key}&redirectUrl=${encodeURIComponent(redirectUrl || '/')}`

	await resend.emails.send({
		from: 'Project X <x@mail.rubric.sh>',
		to: [email],
		subject: 'Your Magic Link',
		react: MagicLinkEmailTemplate({ magicLink })
	})

	redirect('/auth/signin/magiclink/sent')
}

export async function handleSignOut({ redirectUrl }: { redirectUrl: string }) {
	const cookieStore = await cookies()

	cookieStore.delete('key')
	cookieStore.delete('user')

	redirect(redirectUrl)
}
