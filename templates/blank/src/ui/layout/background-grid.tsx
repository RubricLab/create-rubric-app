const lineAttributes = {
	fill: 'none',
	opacity: 0.4,
	stroke: '#a8a29e', // Stone-400
	strokeWidth: 1
}

export default function BackgroundGrid({
	className,
	...props
}: {
	className?: string
	[key: string]: any
}) {
	return (
		<svg
			className={className}
			preserveAspectRatio="xMidYMid slice" // slice means scale the SVG to cover the entire viewport, possibly cropping the SVG in the process
			viewBox="0 0 1000 1000"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<g>
				{/* Vertical lines */}
				<g className="vertical">
					{/* Curving right */}
					<path {...lineAttributes} d="M-70,0 Q80,500 -70,1000" />
					<path {...lineAttributes} d="M80,0 Q200,500 80,1000" />
					<path {...lineAttributes} d="M210,0 Q300,500 210,1000" />
					<path {...lineAttributes} d="M320,0 Q380,500 320,1000" />
					<path {...lineAttributes} d="M410,0 Q440,500 410,1000" />
					<path {...lineAttributes} d="M470,0 Q480,500 470,1000" />
					{/* Curving left */}
					<path {...lineAttributes} d="M530,0 Q520,500 530,1000" />
					<path {...lineAttributes} d="M590,0 Q560,500 590,1000" />
					<path {...lineAttributes} d="M680,0 Q620,500 680,1000" />
					<path {...lineAttributes} d="M790,0 Q700,500 790,1000" />
					<path {...lineAttributes} d="M920,0 Q800,500 920,1000" />
					<path {...lineAttributes} d="M1070,0 Q920,500 1070,1000" />
				</g>
				{/* Horizontal lines */}
				<g className="horizontal">
					{/* Curving up */}
					<path {...lineAttributes} d="M0,-70 Q500,80 1000,-70" />
					<path {...lineAttributes} d="M0,80 Q500,200 1000,80" />
					<path {...lineAttributes} d="M0,210 Q500,300 1000,210" />
					<path {...lineAttributes} d="M0,320 Q500,380 1000,320" />
					<path {...lineAttributes} d="M0,410 Q500,440 1000,410" />
					<path {...lineAttributes} d="M0,470 Q500,480 1000,470" />
					{/* Curving down */}
					<path {...lineAttributes} d="M0,530 Q500,520 1000,530" />
					<path {...lineAttributes} d="M0,590 Q500,560 1000,590" />
					<path {...lineAttributes} d="M0,680 Q500,620 1000,680" />
					<path {...lineAttributes} d="M0,790 Q500,700 1000,790" />
					<path {...lineAttributes} d="M0,920 Q500,800 1000,920" />
					<path {...lineAttributes} d="M0,1070 Q500,920 1000,1070" />
				</g>
			</g>
		</svg>
	)
}
