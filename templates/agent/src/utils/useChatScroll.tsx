// 🙏 https://dev.to/deepcodes/automatic-scrolling-for-chat-app-in-1-line-of-code-react-hook-3lm1

import { useEffect, useRef } from 'react'

export function useChatScroll<T>(_dep: T): React.RefObject<HTMLDivElement | null> {
	const ref = useRef<HTMLDivElement>(null)
	useEffect(() => {
		if (ref.current) ref.current.scrollTop = ref.current.scrollHeight
	}, [])
	return ref
}
