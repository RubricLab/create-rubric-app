'use client'

import type { File } from '@prisma/client'
import {
	type DragEvent,
	type ReactNode,
	createContext,
	useCallback,
	useContext,
	useRef,
	useState
} from 'react'
import { api } from '~/utils/trpc/react'

type FilesContextType = {
	files: (File & { url: string; error?: boolean })[] | undefined
	handleDragIn: (event: Event | DragEvent) => void
	handleDragOut: (event: Event | DragEvent) => void
	handleDrop: (event: Event | DragEvent) => void
	handleDrag: (event: Event | DragEvent) => void
	isDragging: boolean
}

const FilesContext = createContext<FilesContextType>(undefined)

export const useFiles = () => {
	return useContext(FilesContext)
}

export const FilesProvider = ({ children }: { children: ReactNode }) => {
	const [files, setFiles] = useState<(File & { url: string })[]>([])

	const setTemporaryFiles = useCallback(
		(temporaryFiles: (File & { url: string })[]) => {
			setFiles([...(files || []), ...temporaryFiles])
		},
		[files]
	)

	api.file.getAll.useQuery(undefined, {
		onSuccess: data => {
			setFiles(data)
		}
	})

	const presignMutation = api.file.presign.useMutation()

	const confirmMutation = api.file.confirm.useMutation()

	const rejectMutation = api.file.reject.useMutation()

	const [isDragging, setIsDragging] = useState(false)

	const dragCounter = useRef(0)

	const handleDrag = useCallback((event: Event | DragEvent) => {
		event.preventDefault()
		event.stopPropagation()
	}, [])

	const handleDragIn = useCallback((event: Event | DragEvent) => {
		event.preventDefault()
		event.stopPropagation()
		dragCounter.current++
		setIsDragging(true)
	}, [])

	const handleDragOut = useCallback((event: Event | DragEvent) => {
		event.preventDefault()
		event.stopPropagation()
		dragCounter.current--
		if (dragCounter.current > 0) return
		setIsDragging(false)
	}, [])

	const handleDrop = useCallback(
		async (event: Event | DragEvent) => {
			event = event as DragEvent

			event.preventDefault()
			event.stopPropagation()
			setIsDragging(false)

			if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
				dragCounter.current = 0
				const acceptedFiles: FileList = event.dataTransfer.files

				const file = Object.values(acceptedFiles)[0]

				const rejectedFiles: string[] = []

				if (file.size > 100000000) {
					rejectedFiles.push(file.name)
					return false
				}

				console.log('dropped')

				const presignedUrl = await presignMutation.mutateAsync({
					file: {
						name: file.name,
						type: file.type
					}
				})

				const temporaryFile = {
					id: presignedUrl.id,
					url: URL.createObjectURL(file || new Blob()),
					name: file.name,
					type: file.type,
					userId: '',
					uploaded: false
				} as File & { url: string; error?: boolean }

				setTemporaryFiles([temporaryFile])

				const data = {
					...presignedUrl.presignedPost.fields,
					'Content-Type': file.type,
					file: file
				}

				const formData = new FormData()

				for (const name in data) formData.append(name, data[name])

				const response = async () => {
					try {
						const upload = await fetch(presignedUrl.presignedPost.url, {
							method: 'POST',
							body: formData
						})

						if (upload.ok) {
							await confirmMutation.mutateAsync({
								id: presignedUrl.id
							})

							setFiles(prev => {
								const index = prev.findIndex(f => f.id === presignedUrl.id)
								const updatedFiles = [...prev]
								updatedFiles[index] = {
									...(prev[index] as File & { url: string }),
									uploaded: true
								}
								return updatedFiles
							})

							return upload
						}
						return
					} catch (e) {
						await rejectMutation.mutateAsync({ id: presignedUrl.id })

						setFiles(prev => {
							const index = prev.findIndex(f => f.id === presignedUrl.id)
							const updatedFiles = [...prev]
							delete updatedFiles[index]
							return updatedFiles
						})
					}
				}
				return response()
			}
		},
		[confirmMutation, presignMutation, rejectMutation, setTemporaryFiles]
	)

	return (
		<FilesContext.Provider
			value={{
				files,
				handleDragIn,
				handleDragOut,
				handleDrop,
				handleDrag,
				isDragging
			}}
		>
			{children}
		</FilesContext.Provider>
	)
}
