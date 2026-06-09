import { createRef } from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Kbd } from './Kbd'

describe('Kbd', () => {
  it('renders a kbd element with its content', () => {
    render(<Kbd>K</Kbd>)
    const kbd = screen.getByText('K')
    expect(kbd.tagName).toBe('KBD')
  })

  it('stays left-to-right for shortcuts', () => {
    render(<Kbd>Ctrl</Kbd>)
    expect(screen.getByText('Ctrl')).toHaveAttribute('dir', 'ltr')
  })

  it('merges className and forwards the ref', () => {
    const ref = createRef<HTMLElement>()
    render(
      <Kbd ref={ref} className="text-red-500">
        Esc
      </Kbd>,
    )
    expect(ref.current?.tagName).toBe('KBD')
    expect(ref.current).toHaveClass('text-red-500')
  })
})
