import { createRef } from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Avatar } from './Avatar'

describe('Avatar', () => {
  it('renders the image with src and alt', () => {
    render(<Avatar src="/ada.jpg" alt="Ada Lovelace" />)
    const img = screen.getByRole('img', { name: 'Ada Lovelace' })
    expect(img).toHaveAttribute('src', '/ada.jpg')
  })

  it('shows the fallback when there is no src', () => {
    render(<Avatar alt="Ada Lovelace" fallback="AL" />)
    expect(screen.getByText('AL')).toBeInTheDocument()
    expect(screen.queryByRole('img', { name: '' })).not.toBeInTheDocument()
    // The wrapper exposes the name as an img role.
    expect(screen.getByRole('img', { name: 'Ada Lovelace' })).toBeInTheDocument()
  })

  it('falls back when the image fails to load', () => {
    render(<Avatar src="/broken.jpg" alt="Grace" fallback="GH" />)
    fireEvent.error(screen.getByRole('img', { name: 'Grace' }))
    expect(screen.getByText('GH')).toBeInTheDocument()
  })

  it('applies size classes', () => {
    render(<Avatar size="lg" fallback="X" data-testid="av" />)
    expect(screen.getByTestId('av').className).toContain('size-12')
  })

  it('forwards the ref to the wrapper span', () => {
    const ref = createRef<HTMLSpanElement>()
    render(<Avatar ref={ref} fallback="X" />)
    expect(ref.current).toBeInstanceOf(HTMLSpanElement)
  })
})
