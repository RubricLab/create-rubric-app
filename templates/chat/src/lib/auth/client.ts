'use client'

import type { Prisma } from '@prisma/client'
import { CreateAuthContext } from '@rubriclab/auth/client'

export const { ClientAuthProvider, useSession } =
	CreateAuthContext<
		Prisma.SessionGetPayload<{
			include: {
				user: {
					include: {
						apiKeyAuthorizationAccounts: true
						oAuth2AuthenticationAccounts: true
						oAuth2AuthorizationAccounts: true
					}
				}
			}
		}>
	>()
