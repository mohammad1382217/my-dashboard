import { createRef, useState } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Slider } from './Slider'

describe('Slider', () => {
  it('renders a labelled range input', () => {
    render(<Slider label="Volume" defaultValue={30} />)
    const input = screen.getByRole('slider', { name: 'Volume' })
    expect(input).toBeInstanceOf(HTMLInputElement)
    expect(input).toHaveValue('30')
  })

  it('honours min, max and step', () => {
    render(<Slider label="Volume" min={0} max={50} step={5} defaultValue={10} />)
    const input = screen.getByRole('slider')
    expect(input).toHaveAttribute('min', '0')
    expect(input).toHaveAttribute('max', '50')
    expect(input).toHaveAttribute('step', '5')
  })

  it('fires onChange and reflects a controlled value', () => {
    const onChange = vi.fn()
    function Controlled() {
      const [v, setV] = useState(20)
      return (
        <Slider
          label="Volume"
          min={0}
          max={100}
          value={v}
          onChange={(e) => {
            onChange()
            setV(Number(e.target.value))
          }}
        />
      )
    }
    render(<Controlled />)
    const input = screen.getByRole('slider')

    fireEvent.change(input, { target: { value: '60' } })

    expect(onChange).toHaveBeenCalled()
    expect(input).toHaveValue('60')
  })

  it('shows the current value when showValue is set', () => {
    render(<Slider label="Volume" showValue value={42} onChange={() => {}} />)
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('can be disabled', () => {
    render(<Slider label="Volume" disabled defaultValue={10} />)
    expect(screen.getByRole('slider')).toBeDisabled()
  })

  it('forwards the ref to the input', () => {
    const ref = createRef<HTMLInputElement>()
    render(<Slider label="Volume" ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })
})
