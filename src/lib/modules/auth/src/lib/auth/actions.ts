import { createAuthActions } from '@rubriclab/auth/lib/utils'
import { db } from '~/db'
import { env } from '~/env'

export const { getSession } = createAuthActions({
	authProviders: {},
	db,
	unauthorizedUrl: `${env.URL}/auth/signin`
})
