import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import css from './ThemeToggle.module.css'

const SunIcon = (): JSX.Element => (
  <svg
    width='12'
    height='12'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2.5'
    strokeLinecap='round'
    strokeLinejoin='round'
    aria-hidden='true'
  >
    <circle cx='12' cy='12' r='4' />
    <line x1='12' y1='2' x2='12' y2='4' />
    <line x1='12' y1='20' x2='12' y2='22' />
    <line x1='4.93' y1='4.93' x2='6.34' y2='6.34' />
    <line x1='17.66' y1='17.66' x2='19.07' y2='19.07' />
    <line x1='2' y1='12' x2='4' y2='12' />
    <line x1='20' y1='12' x2='22' y2='12' />
    <line x1='4.93' y1='19.07' x2='6.34' y2='17.66' />
    <line x1='17.66' y1='6.34' x2='19.07' y2='4.93' />
  </svg>
)

const MoonIcon = (): JSX.Element => (
  <svg
    width='12'
    height='12'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2.5'
    strokeLinecap='round'
    strokeLinejoin='round'
    aria-hidden='true'
  >
    <path d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' />
  </svg>
)

// Transition duration in ms — must match the CSS transition duration
const TRANSITION_MS = 300

const ThemeToggle: React.FC = () => {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  // Separate visual state so the thumb animates immediately on click,
  // before next-themes fires its transition-suppression script.
  const [visualDark, setVisualDark] = useState(false)

  useEffect(() => {
    setMounted(true)
    setVisualDark(resolvedTheme === 'dark')
  }, [resolvedTheme])

  // Avoid SSR/hydration mismatch — render a placeholder until mounted
  if (!mounted) return <div style={{ width: 52, height: 28 }} />

  const handleClick = (e: React.MouseEvent): void => {
    e.preventDefault()
    e.stopPropagation()
    const next = !visualDark
    // Update visual position immediately → CSS transition fires right away
    setVisualDark(next)
    // Delay the actual theme switch until after the animation completes,
    // so next-themes' "* { transition: none }" doesn't cancel our animation
    setTimeout(() => {
      setTheme(next ? 'dark' : 'light')
    }, TRANSITION_MS)
  }

  return (
    <button
      type='button'
      className={`${css.toggle} ${visualDark ? css.dark : css.light}`}
      onClick={handleClick}
      aria-label={visualDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className={css.iconSun}>
        <SunIcon />
      </span>
      <span
        className={`${css.thumb} ${visualDark ? css.thumbDark : css.thumbLight}`}
      />
      <span className={css.iconMoon}>
        <MoonIcon />
      </span>
    </button>
  )
}

export default ThemeToggle
