import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

export const ArrowUpRight = (props: IconProps) => (
  <svg {...base} {...props}><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>
)
export const ArrowRight = (props: IconProps) => (
  <svg {...base} {...props}><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>
)
export const Gauge = (props: IconProps) => (
  <svg {...base} {...props}><path d="M4 14a8 8 0 1 1 16 0"/><path d="m12 14 4-4"/><path d="M5.5 18h13"/></svg>
)
export const Sparkles = (props: IconProps) => (
  <svg {...base} {...props}><path d="m12 3 1.3 3.7L17 8l-3.7 1.3L12 13l-1.3-3.7L7 8l3.7-1.3L12 3Z"/><path d="m5 14 .8 2.2L8 17l-2.2.8L5 20l-.8-2.2L2 17l2.2-.8L5 14Z"/><path d="m19 13 .8 2.2 2.2.8-2.2.8L19 19l-.8-2.2L16 16l2.2-.8L19 13Z"/></svg>
)
export const Film = (props: IconProps) => (
  <svg {...base} {...props}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 5v14M17 5v14M3 9h4M17 9h4M3 15h4M17 15h4"/></svg>
)
export const Database = (props: IconProps) => (
  <svg {...base} {...props}><ellipse cx="12" cy="5" rx="7" ry="3"/><path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5"/><path d="M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/></svg>
)
export const MessageSquare = (props: IconProps) => (
  <svg {...base} {...props}><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z"/><path d="M8 9h8M8 13h5"/></svg>
)
export const Layers = (props: IconProps) => (
  <svg {...base} {...props}><path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/></svg>
)
export const Check = (props: IconProps) => (
  <svg {...base} {...props}><path d="m5 12 4 4L19 6"/></svg>
)
export const ArrowDown = (props: IconProps) => (
  <svg {...base} {...props}><path d="M12 5v14"/><path d="m6 13 6 6 6-6"/></svg>
)
export const Target = (props: IconProps) => (
  <svg {...base} {...props}><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.4"/><path d="M12 2v2.6M12 19.4V22M2 12h2.6M19.4 12H22"/></svg>
)
export const Menu = (props: IconProps) => (
  <svg {...base} {...props}><path d="M4 7h16M4 12h16M4 17h16"/></svg>
)
export const X = (props: IconProps) => (
  <svg {...base} {...props}><path d="m6 6 12 12M18 6 6 18"/></svg>
)
