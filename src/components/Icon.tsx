import type { SVGProps } from 'react'

export type IconName = 'sun' | 'moon' | 'menu' | 'close' | 'copy' | 'check' | 'download' | 'search'

/**
 * Hidden SVG sprite holding every chrome icon as a <symbol>. Render ONCE near the
 * app root; <Icon> then references a symbol via <use>, so no raw <svg> markup is
 * scattered through the app code. (The base UI components keep their own inline
 * SVGs on purpose, so each stays self-contained and downloadable.)
 */
export function IconSprite() {
  return (
    <svg aria-hidden="true" style={{ display: 'none' }}>
      <symbol id="icon-sun" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </symbol>
      <symbol id="icon-moon" viewBox="0 0 24 24">
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      </symbol>
      <symbol id="icon-menu" viewBox="0 0 24 24">
        <path d="M3 6h18M3 12h18M3 18h18" />
      </symbol>
      <symbol id="icon-close" viewBox="0 0 24 24">
        <path d="M6 6l12 12M18 6L6 18" />
      </symbol>
      <symbol id="icon-copy" viewBox="0 0 24 24">
        <rect x="9" y="9" width="11" height="11" rx="2" />
        <path d="M5 15V5a2 2 0 0 1 2-2h10" />
      </symbol>
      <symbol id="icon-check" viewBox="0 0 24 24">
        <path d="M20 6 9 17l-5-5" />
      </symbol>
      <symbol id="icon-download" viewBox="0 0 24 24">
        <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" />
      </symbol>
      <symbol id="icon-search" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.35-4.35" />
      </symbol>
    </svg>
  )
}

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName
  /** Pixel size for width and height. Defaults to 18. */
  size?: number
}

/** Renders a sprite symbol. Inherits `currentColor` for its stroke. */
export function Icon({ name, size = 18, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <use href={`#icon-${name}`} />
    </svg>
  )
}
