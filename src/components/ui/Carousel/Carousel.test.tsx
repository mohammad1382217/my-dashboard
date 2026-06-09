import { createRef, useState } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Carousel } from './Carousel'

const SLIDES = [<div key="a">Slide A</div>, <div key="b">Slide B</div>, <div key="c">Slide C</div>]

describe('Carousel', () => {
  it('renders all slides and marks the active one', () => {
    render(<Carousel items={SLIDES} label="Gallery" />)
    const slides = screen.getAllByRole('group', { hidden: true })
    expect(slides).toHaveLength(3)
    expect(slides[0]).not.toHaveAttribute('aria-hidden', 'true')
    expect(slides[1]).toHaveAttribute('aria-hidden', 'true')
  })

  it('advances with the next button and fires onValueChange', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<Carousel items={SLIDES} onValueChange={onValueChange} />)

    await user.click(screen.getByRole('button', { name: 'Next slide' }))

    expect(onValueChange).toHaveBeenCalledWith(1)
    const slides = screen.getAllByRole('group', { hidden: true })
    expect(slides[1]).not.toHaveAttribute('aria-hidden', 'true')
  })

  it('disables prev at the start and next at the end (no loop)', () => {
    render(<Carousel items={SLIDES} defaultValue={0} />)
    expect(screen.getByRole('button', { name: 'Previous slide' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Next slide' })).toBeEnabled()
  })

  it('wraps around when loop is enabled', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<Carousel items={SLIDES} loop onValueChange={onValueChange} />)

    await user.click(screen.getByRole('button', { name: 'Previous slide' }))

    expect(onValueChange).toHaveBeenCalledWith(2)
  })

  it('jumps to a slide via its dot', async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<Carousel items={SLIDES} onValueChange={onValueChange} />)

    await user.click(screen.getByRole('button', { name: 'Go to slide 3' }))

    expect(onValueChange).toHaveBeenCalledWith(2)
  })

  it('navigates with the arrow keys', async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [i, setI] = useState(0)
      return <Carousel items={SLIDES} value={i} onValueChange={setI} label="Gallery" />
    }
    render(<Controlled />)

    screen.getByRole('region', { name: 'Gallery' }).focus()
    await user.keyboard('{ArrowRight}')

    expect(screen.getAllByRole('group', { hidden: true })[1]).not.toHaveAttribute('aria-hidden', 'true')
  })

  it('forwards the ref to the root element', () => {
    const ref = createRef<HTMLDivElement>()
    render(<Carousel items={SLIDES} ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})
