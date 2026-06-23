import { createRef } from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Chart } from './Chart'

const data = [
  { label: 'Jan', value: 10 },
  { label: 'Feb', value: 30 },
  { label: 'Mar', value: 20 },
]

describe('Chart', () => {
  it('renders an accessible img with a summary', () => {
    render(<Chart data={data} ariaLabel="Sales chart" />)
    expect(screen.getByRole('img', { name: 'Sales chart' })).toBeInTheDocument()
  })

  it('draws one bar per point in bar mode', () => {
    const { container } = render(<Chart data={data} type="bar" />)
    // Filled rects are the bars; transparent rects are the hover hit-areas.
    expect(container.querySelectorAll('rect:not([fill="transparent"])')).toHaveLength(3)
  })

  it('draws a polyline in line mode', () => {
    const { container } = render(<Chart data={data} type="line" />)
    expect(container.querySelector('polyline')).not.toBeNull()
    // one dot per point
    expect(container.querySelectorAll('circle')).toHaveLength(3)
  })

  it('builds a default aria summary from the data', () => {
    render(<Chart data={data} />)
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', expect.stringContaining('Feb 30'))
  })

  it('forwards the ref', () => {
    const ref = createRef<HTMLDivElement>()
    render(<Chart ref={ref} data={data} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})
