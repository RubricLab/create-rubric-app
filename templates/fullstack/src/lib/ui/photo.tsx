'use client'
import Image from 'next/image'
import { useFiles } from '~/context/fileContext'

export default function Photo() {
	const { files, handleDragIn, handleDragOut, handleDrop, handleDrag, isDragging } = useFiles()

	return (
		<div
			className={`h-10 w-10 overflow-hidden rounded-full border-2 border-neutral-500 ${isDragging ? 'bg-green-500' : ''}`}
			onDragEnter={handleDragIn}
			onDragLeave={handleDragOut}
			onDragOver={handleDrag}
			onDrop={handleDrop}
		>
			{files?.length ? (
				<Image
					src={files[files.length - 1]?.url}
					alt="profile picture"
					width={50}
					height={50}
					layout="contain"
				/>
			) : (
				''
			)}
		</div>
	)
}
