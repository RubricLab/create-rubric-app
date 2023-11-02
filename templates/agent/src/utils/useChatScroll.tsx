// 🙏 https://dev.to/deepcodes/automatic-scrolling-for-chat-app-in-1-line-of-code-react-hook-3lm1

import {useEffect, useRef} from 'react'

export function useChatScroll<T>(
	dep: T
): React.MutableRefObject<HTMLDivElement> {
	const ref = useRef<HTMLDivElement>()
	useEffect(() => {
		if (ref.current) ref.current.scrollTop = ref.current.scrollHeight
	}, [dep])
	return ref
}
