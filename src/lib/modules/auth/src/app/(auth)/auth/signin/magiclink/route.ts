import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { db } from '~/db'

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url)
	const { error, data } = z
		.object({ key: z.string(), redirectUrl: z.string() })
		.safeParse(Object.fromEntries(searchParams.entries()))

	if (error) {
		redirect('/darkmagic')
	}

	const { key, redirectUrl } = data

	const { user } = await db.session.findUniqueOrThrow({
		where: {
			key
		},
		select: {
			user: {
				select: {
					id: true,
					authProviders: {
						select: {
							provider: true,
							accountId: true
						}
					}
				}
			}
		}
	})
	;(await cookies()).set('key', key)
	;(await cookies()).set('user', JSON.stringify(user))
	redirect(redirectUrl)
}
