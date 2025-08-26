'use server'

import { actions } from './server'

export const { signIn, signOut, sendMagicLink, getAuthConstants, getSession } = actions
