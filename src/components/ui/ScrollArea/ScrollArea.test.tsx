import { createRef } from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ScrollArea } from './ScrollArea'

describe('ScrollArea', () => {
  it('renders its children', () => {
    render(
      <ScrollArea className="max-h-20">
        <p>Scrollable content</p>
      </ScrollArea>,
    )
    expect(screen.getByText('Scrollable content')).toBeInTheDocument()
  })

  it('applies overflow classes per orientation', () => {
    const { container, rerender } = render(<ScrollArea>x</ScrollArea>)
    expect(container.firstChild).toHaveClass('overflow-y-auto')
    rerender(<ScrollArea orientation="horizontal">x</ScrollArea>)
    expect(container.firstChild).toHaveClass('overflow-x-auto')
  })

  it('merges className and forwards the ref', () => {
    const ref = createRef<HTMLDivElement>()
    render(<ScrollArea ref={ref} className="max-h-40" />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(ref.current).toHaveClass('max-h-40')
  })
})
