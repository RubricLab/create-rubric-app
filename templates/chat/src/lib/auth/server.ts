import { createAuth, createGithubAuthenticationProvider, prismaAdapter } from '@rubriclab/auth'
import db from '~/db'
import env from '~/env'

export const { routes, actions, __types } = createAuth({
	authUrl: env.NEXT_PUBLIC_AUTH_URL,
	databaseProvider: prismaAdapter(db),
	oAuth2AuthenticationProviders: {
		github: createGithubAuthenticationProvider({
			githubClientId: env.GITHUB_CLIENT_ID,
			githubClientSecret: env.GITHUB_CLIENT_SECRET
		})
	}
})
