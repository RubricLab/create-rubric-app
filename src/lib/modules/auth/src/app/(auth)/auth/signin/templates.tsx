export function MagicLinkEmailTemplate({ magicLink }: { magicLink: string }) {
	return (
		<div>
			<a href={magicLink}>Log in</a>
		</div>
	)
}
