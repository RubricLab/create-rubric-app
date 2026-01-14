import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'
import env from './env'

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL })
const db = new PrismaClient({ adapter })

export default db
