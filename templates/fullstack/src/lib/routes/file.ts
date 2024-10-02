import { GetObjectCommand } from '@aws-sdk/client-s3'
import { createPresignedPost } from '@aws-sdk/s3-presigned-post'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import cuid from 'cuid'
import { z } from 'zod'
import { env } from '~/env.mjs'
import { createTRPCRouter, protectedProcedure } from '~/server/trpc'

export default createTRPCRouter({
	getAll: protectedProcedure.query(async ({ ctx }) => {
		const files = await ctx.db.file.findMany({
			where: {
				userId: ctx.session.user.id
			}
		})

		const extendedFiles = await Promise.all(
			files.map(async file => {
				const url = await getSignedUrl(
					ctx.s3,
					new GetObjectCommand({
						Bucket: env.S3_BUCKET,
						Key: `${ctx.session.user.id}/${file.id}`
					}),
					{}
				)

				return {
					...file,
					url
				}
			})
		)

		return extendedFiles
	}),
	presign: protectedProcedure
		.input(
			z.object({
				file: z.object({
					name: z.string(),
					type: z.string()
				})
			})
		)
		.mutation(async ({ input: { file }, ctx }) => {
			if (!ctx.session?.user) throw 'You must be logged in to upload files.'

			const filesData = {
				id: cuid(),
				name: file.name,
				type: file.type,
				uploaded: false,
				userId: ctx.session.user.id
			}

			await ctx.db.file.create({
				data: filesData
			})

			const presignedUrl = {
				id: filesData.id,
				presignedPost: await createPresignedPost(ctx.s3, {
					Key: `${ctx.session.user.id}/${filesData.id}`,

					Conditions: [
						['starts-with', '$Content-Type', ''],
						['content-length-range', 0, 100000000]
					],
					Expires: 600,
					Bucket: env.S3_BUCKET
				})
			}

			return presignedUrl
		}),
	confirm: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ input, ctx }) => {
			if (!ctx.session?.user) throw 'You must be logged in to upload files.'

			const file = await ctx.db.file.findUnique({
				where: {
					id: input.id,
					userId: ctx.session.user.id
				}
			})

			if (!file) throw 'File not found.'

			await ctx.db.file.update({
				where: {
					id: input.id
				},
				data: {
					uploaded: true
				}
			})

			return !!file
		}),
	reject: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ input, ctx }) => {
		if (!ctx.session?.user) throw 'You must be logged in to upload files.'

		const file = await ctx.db.file.findUnique({
			where: {
				id: input.id,
				userId: ctx.session.user.id
			}
		})

		if (!file) throw 'File not found.'

		await ctx.db.file.delete({
			where: {
				id: input.id
			}
		})

		return !!file
	})
})
