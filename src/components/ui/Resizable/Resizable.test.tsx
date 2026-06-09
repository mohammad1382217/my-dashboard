import { createRef } from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Resizable } from './Resizable'

describe('Resizable', () => {
  it('renders both panels', () => {
    render(<Resizable first={<div>Left</div>} second={<div>Right</div>} />)
    expect(screen.getByText('Left')).toBeInTheDocument()
    expect(screen.getByText('Right')).toBeInTheDocument()
  })

  it('exposes a separator with aria values', () => {
    render(<Resizable first="a" second="b" defaultSize={50} />)
    const sep = screen.getByRole('separator')
    expect(sep).toHaveAttribute('aria-valuenow', '50')
    expect(sep).toHaveAttribute('aria-valuemin', '10')
    expect(sep).toHaveAttribute('aria-valuemax', '90')
    expect(sep).toHaveAttribute('aria-orientation', 'vertical')
  })

  it('resizes with the arrow keys', async () => {
    const user = userEvent.setup()
    render(<Resizable first="a" second="b" defaultSize={50} step={4} />)
    const sep = screen.getByRole('separator')
    sep.focus()
    await user.keyboard('{ArrowRight}')
    expect(sep).toHaveAttribute('aria-valuenow', '54')
    await user.keyboard('{ArrowLeft}{ArrowLeft}')
    expect(sep).toHaveAttribute('aria-valuenow', '46')
  })

  it('clamps to min/max with Home/End', async () => {
    const user = userEvent.setup()
    render(<Resizable first="a" second="b" minSize={20} maxSize={80} />)
    const sep = screen.getByRole('separator')
    sep.focus()
    await user.keyboard('{End}')
    expect(sep).toHaveAttribute('aria-valuenow', '80')
    await user.keyboard('{Home}')
    expect(sep).toHaveAttribute('aria-valuenow', '20')
  })

  it('forwards the ref', () => {
    const ref = createRef<HTMLDivElement>()
    render(<Resizable ref={ref} first="a" second="b" />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})
