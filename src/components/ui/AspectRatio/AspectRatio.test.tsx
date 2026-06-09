import { createRef } from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AspectRatio } from './AspectRatio'

describe('AspectRatio', () => {
  it('renders its children', () => {
    render(
      <AspectRatio ratio={1}>
        <img alt="square" src="/x.jpg" />
      </AspectRatio>,
    )
    expect(screen.getByAltText('square')).toBeInTheDocument()
  })

  it('reserves space via padding-bottom from the ratio', () => {
    const { container } = render(<AspectRatio ratio={2} data-testid="ar" />)
    // 100 / 2 = 50%
    expect(container.firstChild).toHaveStyle({ paddingBottom: '50%' })
  })

  it('merges className and forwards the ref to the content box', () => {
    const ref = createRef<HTMLDivElement>()
    render(<AspectRatio ref={ref} className="rounded-xl" />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(ref.current).toHaveClass('rounded-xl', 'absolute')
  })
})
